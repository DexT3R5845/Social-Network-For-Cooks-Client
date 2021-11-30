import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CookieService } from "ngx-cookie-service";
import { Account } from "../_models/account";

@Injectable({
    providedIn: 'root'
  })
  export class CookieStorageService {
    constructor(private cookieService: CookieService) {}

    getToken(): string {
      return this.cookieService.get('token');
    }
  
    setToken(token: string): void {
      this.cookieService.set('token', token);
    }
  
    deleteToken(): void {
      return this.cookieService.delete('token');
    }

    clear() {
        this.cookieService.deleteAll();
    }
  }