import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '../authentication.service';
import { Credentials } from '../credentials';
import {ReCaptcha2Component} from 'ngx-captcha';
import { AuthResponse } from '../auth_repsonse';
import { JwtTokenService } from '../jwt-token.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  creds: Credentials = {email: '', password: ''};
  incorrect: boolean = false;
  response: AuthResponse;
  siteKey: string = "6Le3qCodAAAAAJWMyzjp3R7igz2rIEQoM7UWRbns";
  showCaptcha: boolean = false;
  disableButton: boolean = false;
  attemptCounter: number = 1;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  
  constructor(private router: Router, 
    private authService: AuthService, 
    private jwtService: JwtTokenService ) { }

  ngOnInit(): void {
  }

  authorize(creds: Credentials) : void {
    this.authService.signIn(this.creds).pipe(first())
    .subscribe(response => {
      if (response.status === 200) {
        this.jwtService.setToken(response.token);
        this.router.navigate(['main_page']);
      }
      else {
        this.incorrect = true;
        if (this.attemptCounter >= 5) {
          this.showCaptcha = true;
          this.disableButton = true;
          this.captchaElem.resetCaptcha();
        }
        this.attemptCounter += 1;
      }
    });
  }

  removeWarning(): void {
    this.incorrect = false;
  }

  handleCaptchaSuccess(event: any): void {
    this.disableButton = false;
  }
 
}
