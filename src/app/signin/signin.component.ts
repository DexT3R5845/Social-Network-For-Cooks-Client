import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../account';
import { AccountService } from '../account.service';
import { Credentials } from '../credentials';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  creds: Credentials = {id: 0, email: '', password: ''};
  incorrect: boolean = false;
  account: Account;
  
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
    }
  }

  signIn(): void {
    this.accountService.signIn(this.creds)
    .subscribe(acc => this.account = acc);
  }

  removeWarning(): void {
    this.incorrect = false;
  }

}
