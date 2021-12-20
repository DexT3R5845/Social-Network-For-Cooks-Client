import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieStorageService } from '../_helpers/cookies.storage';
import { Account } from '../_models/account';

const baseUrl = `${environment.serverUrl}/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accountSubject: BehaviorSubject<Account | null>;
  public account: Observable<Account | null>;

  constructor(
    private http: HttpClient,
    private cookie:CookieStorageService,
    private jwt: JwtHelperService,
    private router: Router
  ) {
    const token = this.cookie.getToken();
  if(token && !this.jwt.isTokenExpired(token)){
    const tokenData = this.jwt.decodeToken(token);
    this.accountSubject = new BehaviorSubject<Account | null>({email: tokenData.sub, role: tokenData.auth, token: token});
    }
    else
      this.accountSubject = new BehaviorSubject<Account | null>(null);
    this.account = this.accountSubject.asObservable();
  }

  forgotPassword(email: string): Observable<Object> {
    let httpParams = new HttpParams().set('email', email);
    const httpOptions = {
      params: httpParams
    };
    return this.http.post(`${baseUrl}/password/resetlink`,{}, httpOptions);
  }

  signIn(email: string, password: string, recaptchaToken: string): Observable<Account> {
    let reqParams = new HttpParams().set('email', email).set('password', password).set('g-recaptcha-response', recaptchaToken ? recaptchaToken : '');
    return this.http.post<Account>(`${baseUrl}/signin`, {}, { withCredentials: true, params: reqParams })
      .pipe(map(response => {
        const tokenData = this.jwt.decodeToken(response.token);
        this.accountSubject.next({email: tokenData.sub, role: tokenData.auth, token: response.token});
      return response;
  }));
  }

logout(): void{
  this.cookie.clear();
  this.accountSubject.next(null);
  this.router.navigateByUrl('/account/signin');
}

signUp(account: Account): Observable<Object> {
  return this.http.post(`${baseUrl}/signup`, account);
}

validateResetToken(token: string): Observable<Object> {
  let reqParams = new HttpParams().set('token', token);
  return this.http.get(`${baseUrl}/password/reset`, { params: reqParams });
}

resetPassword(token: string, password: string, confirmPassword: string): Observable<Object> {
  return this.http.put(`${baseUrl}/password/reset`, { token, password, confirmPassword });
}

validateConfirmToken(token: string): Observable<Object> {
  let reqParams = new HttpParams().set('token', token);
  return this.http.get(`${baseUrl}/password/creation`, { params: reqParams });
}

  confirmModerator(token: string, password: string, confirmPassword: string): Observable<Object> {
  return this.http.put(`${baseUrl}/password/creation`, { token, password, confirmPassword });
}

public get accountValue() : Account | null {
  return this.accountSubject.value;
}

}
