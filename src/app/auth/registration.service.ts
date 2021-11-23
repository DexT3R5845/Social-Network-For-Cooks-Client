import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { User } from '../user';





@Injectable({
  providedIn: 'platform'
})



export class RegistrationService {

  constructor(private http: HttpClient) { }
  private signupUrl = 'http://localhost:8080/api/auth/signup';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };



   signUp(info:User): Observable<any> {
    return this.http.post<any>(
      this.signupUrl,
      {name: info.getName(),
        surname: info.getSurname(),
        birthDate: info.getBirthDate(),
        gender: info.getGender().gender,
        email: info.getEmail(),
        password: info.getPassword(),
        confirmPassword: info.getConfirmPassword()
      },
      this.httpOptions
      ).pipe(
      map(data => {
        data.status = 200;
        return data;
      })
      // ,
      // catchError(this.handleError);
    );


  }
}
