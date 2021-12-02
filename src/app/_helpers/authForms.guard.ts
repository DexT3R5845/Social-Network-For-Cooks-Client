import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "../_services";
import { CookieStorageService } from "./cookies.storage";

@Injectable({
    providedIn: 'root'
  })
export class AuthFormsGuard implements CanActivate{

    constructor(
        private router:Router,
        private cookie: CookieStorageService,
        private jwt: JwtHelperService,
        private authService: AuthService
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = this.cookie.getToken();
        if(token){
            if(this.jwt.isTokenExpired(token)){
                this.authService.logout();
                return true;
            }
            this.router.navigate(['/profile']);
            return false;
        }

        return true;
    }

}