import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from './auth-repsonse';
import { RequestInterceptor } from './interceptor';
import { JwtTokenService } from './jwt-token.service';
import { TestResponse } from './test-response';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient, private tokenService: JwtTokenService) { }

  sendRequest(): Observable<TestResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const url = `${environment.serverUrl}/auth/test`;
    return this.http.get<TestResponse>(url, httpOptions).pipe(
      catchError(this.handleError())
    );
  }

  private handleError(result?: TestResponse) {
    return (error: HttpErrorResponse): Observable<TestResponse> => {
      const response: TestResponse = {status: error.error.status, email: ''};
      return of(response);
    };
  }

  logout(): void {
    this.tokenService.deleteToken();
  }
}