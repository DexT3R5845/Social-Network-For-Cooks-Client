import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Credentials } from './credentials';
import { AuthResponse } from './auth-repsonse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signIn(creds: Credentials): Observable<AuthResponse> {
    const url = `${environment.serverUrl}/auth/signin`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {email: creds.email, password: creds.password},
    };
    return this.http.post<AuthResponse>(url, {}, httpOptions).pipe(
      map(data => {
        data.status = 200;
        return data;
      }),
      catchError(this.handleError())
    );
  }


  private handleError(operation = 'operation', result?: AuthResponse) {
    return (error: HttpErrorResponse): Observable<AuthResponse> => {
      const response: AuthResponse = {status: error.error.status, token: ''};
      return of(response);
    };
  }
}