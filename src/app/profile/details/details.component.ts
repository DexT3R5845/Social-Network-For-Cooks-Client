import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Profile } from 'src/app/_models/profile';
import { ProfileService } from 'src/app/_services/profile.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  profileData: Profile;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  loading = true;
  gender:boolean;
  url:string;

  constructor(private profileService: ProfileService, private router: Router){}

  ngOnInit(): void {
    this.profileService.getProfileData()
      .pipe(takeUntil(this.destroy))
      .subscribe((data: Profile) => {
        this.profileData = new Profile(data.firstName, data.lastName, data.birthDate, data.gender, data.imgUrl);
        this.loading=false;
        this.gender = this.profileData.gender === "F";
        this.url = this.profileData.imgUrl;
      });
  }

  edit(){
    this.router.navigateByUrl('/profile/edit-details');
  }

  changePassword(){
    this.router.navigateByUrl('/profile/change-password');
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
