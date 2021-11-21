import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

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

  signIn(creds: Credentials, captchaResponse: string): Observable<AuthResponse> {
    const url = `${environment.serverUrl}/auth/signin`;
    let params = new HttpParams().set('email', creds.email).set('password', creds.password);
    if (captchaResponse) {
      params = params.set('g-recaptcha-response', captchaResponse);
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: params
    };
    return this.http.post<AuthResponse>(url, {}, httpOptions).pipe(
      map(data => {
        data.status = 200;
        data.enableCaptcha = false;
        return data;
      }),
      catchError(this.handleError())
    );
  }


  private handleError(result?: AuthResponse) {
    return (error: HttpErrorResponse): Observable<AuthResponse> => {
      const response: AuthResponse = {status: error.status, token: '', enableCaptcha: false, 
    invalidCreds: false, invalidEmailFormat: false, invalidPassFormat: false, banned: false};
        response.enableCaptcha = error.error.need_captcha;
      if (error.status === 401) {
        response.invalidCreds = true;
      }
      else if (error.status === 400) {
        if (error.error.data.email) {
          response.invalidEmailFormat = true;
        }
        if (error.error.data.password) {
          response.invalidPassFormat = true;
        }
      }
      else if (error.status === 403) {
        response.banned = true;
      }
      return of(response);
    };
  }
}
