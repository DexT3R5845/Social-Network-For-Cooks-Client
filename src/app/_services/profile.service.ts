import {HttpClient, HttpParams} from "@angular/common/http";
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

  saveChanges(profile: Profile) {
    return this.http.put(
      `${baseUrl}/profile`, profile
    )
  }

  getProfileData() {
      return this.http.get<Profile>(`${baseUrl}/profile`);
  }

  changePassword(oldPassword:string, newPassword:string){
    let reqParams = new HttpParams();
    reqParams = reqParams.append('oldPassword', oldPassword);
    reqParams = reqParams.append('newPassword', newPassword);
    return this.http.put(`${baseUrl}/profile/changePassword`,{},{params:reqParams})
  }
}
