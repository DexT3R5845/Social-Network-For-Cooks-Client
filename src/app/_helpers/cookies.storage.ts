import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
  })
  export class CookieStorageService {
    constructor(private cookieService: CookieService) {}

    getToken(): string {
      return this.cookieService.get('token');
    }
  
    setToken(token: string): void {
      this.cookieService.set('token', token, {path: '/'});
    }
  
    deleteToken(): void {
      return this.cookieService.delete('token');
    }

    clear() {
        this.cookieService.deleteAll();
    }
  }