import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {UserUpdate} from './user-update'
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  constructor(private http: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  putData(user: UserUpdate) {
    const url = `${environment.serverUrl}/user/profile`
    return this.http.put(
      url,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        gender: user.gender.gender,
        imgUrl: user.imgUrl
      },
      this.httpOptions
    )
  }

  getUserProfile(){
    const url = `${environment.serverUrl}/user/profile`
    return this.http.get(url,this.httpOptions);
  }
}
