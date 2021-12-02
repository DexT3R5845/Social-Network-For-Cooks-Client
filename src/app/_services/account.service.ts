import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Profile } from "../_models/profile";

const baseUrl = `${environment.serverUrl}/user`;

@Injectable({
    providedIn: 'root'
  })
  export class AccountService{

    constructor(
        private http: HttpClient,
    ){}
      getProfileData() {
          return this.http.get<Profile>(`${baseUrl}/profile`);
      }
  }