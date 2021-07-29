import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRange } from '@ionic/angular';
import { Howl } from 'howler';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('range', { static: false }) range: IonRange;

  ituneSongList: any;
  activeTrack: any = null;
  player: Howl = null;
  isPlaying = false;
  progress = 0;

  constructor(
    private apiSvc: ApiService
  ) {
    this.ituneSongList = [];
  }

  ionViewWillEnter() {
    this.getAllSongs();
  }

  startTrack(track: any): void {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.previewUrl],
      html5: true,
      onplay: () => {
        console.log('onplay');
        this.isPlaying = true;
        this.activeTrack = track;
      },
      onend: () => {
        console.log('onend');
      }
    });
    this.player.play();
  }

  togglePlayer(pause: boolean): void {
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  nextTrack(): void {

  }

  prevTrack(): void {
    const idx = this.ituneSongList.indexOf(this.activeTrack);
    if (idx > 0) {
      this.startTrack(this.ituneSongList[idx - 1]);
    } else {
      this.startTrack(this.ituneSongList.length - 1);
    }
  }

  seekTrack(): void {
    const valueProgress = +this.range.value;
    const duration = this.player.duration();
    this.player.seek(duration * (valueProgress / 10));
  }

  updateProgress(): void {
    const seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 100);
  }

  getAllSongs(): void {
    this.apiSvc.getData('Noah').subscribe(
      response => {
        this.ituneSongList = response;
      }
    );
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      if (this.ituneSongList.length === 100) {
        event.target.disabled = true;
      }
    }, 500);
  }
}
