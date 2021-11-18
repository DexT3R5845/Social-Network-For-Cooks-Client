import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { JwtTokenService } from "./jwt-token.service";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
  })
export class RequestInterceptor implements HttpInterceptor {

    constructor(private tokenService: JwtTokenService, /*private jwtHelper: JwtHelperService*/) {}
    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.tokenService.getToken();
        if (token /*&& !this.jwtHelper.isTokenExpired(token)*/) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + token)
            });

            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}