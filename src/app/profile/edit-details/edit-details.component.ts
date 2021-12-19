import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileService} from "../../_services/profile.service";
import {Router} from "@angular/router";
import {ReplaySubject, takeUntil} from "rxjs";
import {Profile} from "../../_models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../_services";
import {MatDialog} from '@angular/material/dialog';
import {DialogViewComponent} from "../dialog-view/dialog-view.component";
import * as moment from 'moment';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.scss']
})
export class EditDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {
  }

  hide: boolean = false;
  profileData: Profile;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;
  form = new FormGroup({
    firstName: new FormControl('', [Validators.pattern('^([A-Z a-z]){3,35}$')]),
    lastName: new FormControl('', [Validators.pattern('^([A-Z a-z]){3,35}$')]),
    date: new FormControl(''),
    gender: new FormControl(''),
    imgUrl: new FormControl('')
  })

  url: string;
  oldImageUrl: string;
  newImageUrl: string;
  acceptedFilesFormats: string[] = ['png', 'jpg', 'jpeg', 'bpg'];

  openDialog(): void {
    this.alertService.clear();
    const dialogRef = this.dialog.open(DialogViewComponent, {
      width: '300px',
      data: {imgUrl: this.newImageUrl},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.newImageUrl = result;
      if (this.newImageUrl !== undefined && this.newImageUrl !== '') {
        if (this.acceptedFilesFormats.includes(result.split('.').pop().toLowerCase())) {
          this.form.value.imgUrl = this.newImageUrl;
          this.url = this.newImageUrl;
          this.hide = true;
          return;
        }
        this.alertService.error('Uncorrected file format',true,true);
      }
    });
  }

  delete(): void {
    this.alertService.clear();
    this.hide = false
    this.url = this.oldImageUrl;
    this.form.value.imgUrl = this.oldImageUrl;
  }

  ngOnInit(): void {
    this.profileService.getProfileData()
      .pipe(takeUntil(this.destroy))
      .subscribe((data: Profile) => {
        this.profileData = data;
        this.form.setValue({
          firstName: this.profileData.firstName,
          lastName: this.profileData.lastName,
          date: moment(this.profileData.birthDate, "DD/MM/YYYY"),
          gender: this.profileData.gender,
          imgUrl: this.profileData.imgUrl
        });
        this.oldImageUrl = this.profileData.imgUrl;
        this.url = this.oldImageUrl;
      });
  }

  submit(): void {
    this.hide = false
    this.alertService.clear();
    let profile: Profile = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      birthDate: this.form.value.date.format("DD/MM/YYYY"),
      gender: this.form.value.gender,
      imgUrl: this.form.value.imgUrl
    }
    this.profileService.saveChanges(profile)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success('Data changed',true,true);
        },
        error: error => {
          switch (error.status) {
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
          this.alertService.error(this.alertMessage,true,true);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  get firstNameErrorMessage(): string {
    return this.form.controls['firstName'].hasError('required') ?
      'Please provide a valid name' :
      this.form.controls['firstName'].hasError('pattern') ?
        'The name must contain only letters. Min length 3 characters' : '';
  }

  get lastNameErrorMessage(): string {
    return this.form.controls['lastName'].hasError('required') ?
      'Please provide a valid lastname' :
      this.form.controls['lastName'].hasError('pattern') ?
        'The lastname must contain only letters. Min length 3 characters' : '';
  }

  back(): void {
    this.router.navigateByUrl('/profile');
  }
}
