import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor(private cookieService: CookieService) {}

  getToken(): string {
    return this.cookieService.get(environment.tokenName);
  }

  setToken(token: string): void {
    this.cookieService.set(environment.tokenName, token);
  }

  // deleteToken(): void {
  //   return this.cookieService.delete(environment.tokenName);
  // }
}
