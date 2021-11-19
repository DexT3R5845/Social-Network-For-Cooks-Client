import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtTokenService } from './jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  public jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(public tokenService: JwtTokenService, public router: Router) {}
  canActivate(): boolean {
    if (!this.tokenService.getToken() || this.jwtHelper.isTokenExpired(this.tokenService.getToken())) {
      this.router.navigate(['signin']);
      return false;
    }
    return true;
  }
}
