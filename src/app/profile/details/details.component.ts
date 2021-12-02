import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { Profile } from 'src/app/_models/profile';
import { AccountService } from 'src/app/_services/account.service';
import { ProfileModule } from '../profile.module';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
profileData: Profile;
destroy: ReplaySubject<any> = new ReplaySubject<any>();
loading = true;

  constructor(
    private accountService: AccountService
  ) {
    this.accountService.getProfileData()
    .pipe(takeUntil(this.destroy))
    .subscribe((data: Profile) => {
      this.profileData = data;
      this.loading=false;
    });
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
