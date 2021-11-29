import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../_models/account';

const baseUrl = `${environment.serverUrl}/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private accountSubject: BehaviorSubject<Account>;

  constructor(
    private http: HttpClient
  ) { }

  forgotPassword(email: string) {
    let httpParams = new HttpParams().set('email', email);
    const httpOptions = {
      params: httpParams
    };
    return this.http.post(`${baseUrl}/password/resetlink`,{}, httpOptions);
  }

  signIn(email: string, password: string) {
    return this.http.post<any>(`${baseUrl}/signin`, { email, password }, { withCredentials: true })
        .pipe(map(account => {
            this.accountSubject.next(account);
            //this.startRefreshTokenTimer();
            return account;
        }));
}

signUp(account: Account) {
  return this.http.post(`${baseUrl}/signup`, account);
}

validateResetToken(token: string) {
  let reqParams = new HttpParams().set('token', token);
  return this.http.get(`${baseUrl}/password/reset`, { params: reqParams });
}

resetPassword(token: string, password: string, confirmPassword: string) {
  return this.http.put(`${baseUrl}/password/reset`, { token, password, confirmPassword });
}

}
