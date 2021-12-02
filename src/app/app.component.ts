import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Account } from './_models/account';
import { Role } from './_models/role';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'Bake&Sweets';
  account : Account | null;
  subscription: Subscription;

  constructor(
    private authService: AuthService
  ){
    this.subscription = this.authService.account.subscribe((x => this.account = x));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }
}
