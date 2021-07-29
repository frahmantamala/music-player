import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Itunes } from '../model/itunes';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = `${environment.apiBaseUrl}search/?term=`;
  }

  getData(artist: string): Observable<any> {
    return this.http.get<Itunes>(`${this.apiUrl}${artist}&media=music&&sort=popularitylimit=25&country=id`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
