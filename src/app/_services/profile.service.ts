import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Profile } from "../_models/profile";

const baseUrl = `${environment.serverUrl}/user`;

@Injectable({
    providedIn: 'root'
  })
export class ProfileService {

  constructor(
      private http: HttpClient,
  ){}

  putData(user: Profile) {
    const url = `${baseUrl}/profile`;
    return this.http.put(
      url,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        gender: user.gender,
        imgUrl: user.imgUrl
      }
    )
  }

  getProfileData() {
      return this.http.get<Profile>(`${baseUrl}/profile`);
  }
}
