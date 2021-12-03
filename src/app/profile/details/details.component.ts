import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Profile } from 'src/app/_models/profile';
import { ProfileService } from 'src/app/_services/profile.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
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
  settingsForm = new FormGroup({
    firstName: new FormControl({value: '', disabled: true}),
    lastName: new FormControl({value: '', disabled: true}),
    date: new FormControl({value: '', disabled: true}),
    gender: new FormControl({value: '', disabled: true}),
    imgUrl: new FormControl({value: '', disabled: true})
  })

  constructor(private profileService: ProfileService, private router: Router){}

  ngOnInit(): void {
    this.profileService.getProfileData()
      .pipe(takeUntil(this.destroy))
      .subscribe((data: Profile) => {
        this.profileData = new Profile(data.firstName, data.lastName, data.birthDate, data.gender, data.imgUrl);
        this.loading=false;
        this.settingsForm.setValue({
          firstName: this.profileData.firstName,
          lastName: this.profileData.lastName,
          date: this.profileData.birthDate,
          gender: this.profileData.gender,
          imgUrl: this.profileData.imgUrl
        });
      });
  }

  edit(){
    this.router.navigateByUrl('/profile/edit-details');
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
