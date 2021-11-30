import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha';
import { CookieService } from 'ngx-cookie-service';
import { finalize, first } from 'rxjs';
import { CookieStorageService } from 'src/app/_helpers/cookies.storage';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  form: FormGroup;
  alertMessage: string;
  isInvalidData = false;
  hide = true;
  siteKey = environment.siteKey;
  isCaptcha = false;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private router: Router,
  private cookie: CookieStorageService,
){
  this.form = this.formBuilder.group({
    email: ['', Validators.email],
    password: ['', Validators.required],
    recaptcha: []
  });
}

ngOnInit(){
}

get control(){return this.form.controls}

onSubmit() {
  this.isInvalidData = false;
  if (this.form.valid) {
    this.authService.signIn(this.control['email'].value, this.control['password'].value, this.control['recaptcha'].value)
            .pipe(first())
            .pipe(finalize(() => ""))
            .subscribe({
                next: next => {
                  this.cookie.setToken(next.token);
                  this.router.navigateByUrl('/profile');
              },
                error: error => {
                  switch(error.status){
                    case 400:
                      this.alertMessage = "Email format is invalid";
                      break;
                      case 401:
                        this.alertMessage = "Invalid username/password supplied";
                        break;
                    case 404:
                      this.alertMessage = error.error.message;
                      break;
                      case 422:
                        this.alertMessage = "Prove you're not a robot";
                        this.isCaptcha = true;
                        this.form.controls['recaptcha'].addValidators(Validators.required);
                        break;
                      default:
                        this.alertMessage = "There was an error on the server, please try again later."
                        break;
                  }                  
                this.isInvalidData = true;}
            });
            this.captchaElem.resetCaptcha();
  }
}

}
