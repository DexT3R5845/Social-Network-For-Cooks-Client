import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Account } from './account';
import { AccountSignUpDto } from './account_sign_up_dto';
import { Credentials } from './credentials';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private serverUrl = 'http://localhost:8080/api';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  //temporary replacement isntead of server
  curr_id = 2;
  accounts: Account[] = [{id: 1, firstName: "name", lastName: "lasyname", 
  birthDate: new Date('2001-01-01'), gender: 'MALE', image: 'aaa', 
  role: {id: 1, roleName: 'user'}, 
  credentials: {email: 'a@gmail.com', password: '1234'}}];

  constructor(private http: HttpClient) { }

  signIn(creds: Credentials): Observable<string> {
    const url = `${this.serverUrl}/sign-in`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {email: creds.email, password: creds.password},
    };
    console.log("url: " + url);
    return this.http.post<string>(url, {}, httpOptions).pipe(
      catchError(this.handleError<string>('signIn'))
    );
    // const result = this.accounts.find(i => i.credentials.email === creds.email && 
    //   i.credentials.password === creds.password);
    // if (result) {
    //   return of(result);
    // }
    // else {
    //   return of();
    // }
  }

  signUp(accountDto: AccountSignUpDto): Observable<Account> {
    const url = `${this.serverUrl}/sign-up`;
    // return this.http.post<Account>(url, accountDto, this.httpOptions).pipe(
    //   catchError(this.handleError<Account>('signUp'))
    // );
    this.accounts.push({id: this.curr_id, firstName: accountDto.firstName, 
    lastName: accountDto.lastName, 
    birthDate: accountDto.birthDate, gender: accountDto.gender, image: 'aaa', 
    role: {id: 1, roleName: 'user'},
    credentials: accountDto.credentials});
    this.curr_id = this.curr_id + 1;
    const result = this.accounts[this.accounts.length - 1];
    return of(result);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //temporary
      return of(result as T);
    };
  }
}
