import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject, takeUntil} from 'rxjs';
import {Profile} from 'src/app/_models/profile';
import {ProfileService} from 'src/app/_services/profile.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  profileData: Profile;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  url: string;

  constructor(private profileService: ProfileService, private router: Router) {
  }

  ngOnInit(): void {
    this.profileService.getProfileData()
      .pipe(takeUntil(this.destroy))
      .subscribe((data: Profile) => {
        this.profileData = data;
        this.profileData.gender = this.profileData.gender === "F" ? "Female" : "Male";
        this.url = this.profileData.imgUrl;
      });
  }

  edit(): void {
    this.router.navigateByUrl('/profile/edit-details');
  }

  changePassword(): void {
    this.router.navigateByUrl('/profile/change-password');
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
