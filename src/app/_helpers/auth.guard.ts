import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../_services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
        const account = this.authService.accountValue;
        if (account) {
        if (route.data['roles'] && !route.data['roles'].includes(account.role)) {
            this.router.navigate(['/profile']);
            return false;
        }
        return true;
    }

    this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
}

}