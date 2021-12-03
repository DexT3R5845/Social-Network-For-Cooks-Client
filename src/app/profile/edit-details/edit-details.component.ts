import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileService} from "../../_services/profile.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, ReplaySubject, takeUntil} from "rxjs";
import {Profile} from "../../_models/profile";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PasswordValidatorShared} from "../../account/sharedClass/passwordValidatorShared";
import {AlertService} from "../../_services";

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.scss']
})
export class EditDetailsComponent extends PasswordValidatorShared implements OnInit, OnDestroy {

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) {
    super();
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.pattern('^([A-Z a-z]){3,35}$')]),
      lastName: new FormControl('', [Validators.pattern('^([A-Z a-z]){3,35}$')]),
      date: new FormControl(''),
      gender: new FormControl(''),
      imgUrl: new FormControl('')
    })
  }

  profileData: Profile;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;

  ngOnInit(): void {
    this.profileService.getProfileData()
      .pipe(takeUntil(this.destroy))
      .subscribe((data: Profile) => {
        this.profileData = new Profile(data.firstName, data.lastName, data.birthDate, data.gender, data.imgUrl);
        this.form.setValue({
          firstName: this.profileData.firstName,
          lastName: this.profileData.lastName,
          date: this.profileData.birthDate,
          gender: this.profileData.gender,
          imgUrl: this.profileData.imgUrl
        });
      });
  }

  submit() {
    let user = new Profile(
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.date,
      this.form.value.gender,
      this.form.value.imgUrl
    )
    this.profileService.putData(user)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success('Data changed', true);
        },
          error: error => {
            switch(error.status){
              case 400:
                this.alertMessage = "Something went wrong";
                break;
              case 409:
                this.alertMessage = error.error.message;
                break;
              default:
                this.alertMessage = "There was an error on the server, please try again later."
                break;
            }
            this.alertService.error(this.alertMessage);
          }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  get firstNameErrorMessage(): string {
    return this.control['firstName'].hasError('required') ?
      'Please provide a valid name' :
      this.control['firstName'].hasError('pattern') ?
        'The name must contain only letters. Min length 3 characters' : '';
  }
}
