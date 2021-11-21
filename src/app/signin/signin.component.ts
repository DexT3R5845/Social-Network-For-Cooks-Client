import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '../authentication.service';
import { Credentials } from '../credentials';
import {ReCaptcha2Component} from 'ngx-captcha';
import { AuthResponse } from '../auth-repsonse';
import { JwtTokenService } from '../jwt-token.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  creds: Credentials = {email: '', password: ''};
  siteKey: string = "6Le3qCodAAAAAJWMyzjp3R7igz2rIEQoM7UWRbns";
  showCaptcha: boolean = false;
  captchaResponse: string;
  disableButton: boolean = false;
  invalidEmailFormat: boolean = false;
  invalidPassFormat: boolean = false;
  invalidCreds: boolean = false;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  authorizeForm :any;
  get email(){return this.authorizeForm.get("email")}
  get password(){return this.authorizeForm.get("password")}
  
  constructor(private router: Router, 
    private authService: AuthService, 
    private jwtService: JwtTokenService ) { }

  ngOnInit(): void {
    this.authorizeForm = new FormGroup({    

      "email": new FormControl("", [
         Validators.required,
          Validators.email
        ]),
    
      "password": new FormControl("", [
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,35}$')
      ])
      
    });
  }

  authorize() : void {
    const creds: Credentials = this.authorizeForm.value;
    if (this.showCaptcha) {
      this.captchaResponse = this.captchaElem.getResponse();
    }
    this.authService.signIn(creds, this.captchaResponse).pipe(first())
    .subscribe(response => {
      if (response.token) {
        this.jwtService.setToken(response.token);
        this.router.navigate(['main_page']);
      }
      else {
        if (response.enableCaptcha === true) {
          this.showCaptcha = true;
          this.disableButton = true;
          if (this.captchaElem)
          {
            this.captchaElem.resetCaptcha();
          }
        }
        this.invalidEmailFormat = response.invalidEmailFormat;
        this.invalidPassFormat = response.invalidPassFormat;
        this.invalidCreds = response.invalidCreds;
      }
    });
  }

  handleCaptchaSuccess(event: any): void {
    this.disableButton = false;
  }
 
}
