import { Component, OnInit } from '@angular/core';
import { Account } from './_models/account';
import { Role } from './_models/role';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bake&Sweets';
  account : Account | null;

  constructor(
    private authService: AuthService
  ){
    this.authService.account.subscribe((x => this.account = x));
  }

  logout(){
    this.authService.logout();
  }
}
