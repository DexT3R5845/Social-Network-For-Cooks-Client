import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Account } from '../account';
import { AccountService } from '../account.service';
import { Credentials } from '../credentials';
import {ReCaptcha2Component} from 'ngx-captcha';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  creds: Credentials = {email: '', password: ''};
  incorrect: boolean = false;
  account: Account;
  siteKey: string = "6Le3qCodAAAAAJWMyzjp3R7igz2rIEQoM7UWRbns";
  showCaptcha: boolean = false;
  disableButton: boolean = false;
  attemptCounter: number = 1;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  
  constructor(private router: Router, private accountService: AccountService) { }

  ngOnInit(): void {
  }

  authorize(creds: Credentials) : void {
    this.signIn();
    if (this.account) {
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
  }

  signIn(): void {
    this.accountService.signIn(this.creds).pipe(first())
    .subscribe(acc => console.log(acc + "aaa"));
  }

  removeWarning(): void {
    this.incorrect = false;
  }

  handleCaptchaSuccess(event: any): void {
    this.disableButton = false;
  }
 
}
