import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileService} from "../../_services/profile.service";
import {Router} from "@angular/router";
import {ReplaySubject, takeUntil} from "rxjs";
import {Profile} from "../../_models/profile";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../_services";
import {MatDialog} from '@angular/material/dialog';
import {DialogViewComponent} from "../dialog-view/dialog-view.component";

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

  hide = false;
  loading = true;
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
  acceptedFilesFormats: string[] = ['png', 'jpg', 'jpeg', 'tiff', 'bpg'];

  openDialog() {
    this.alertService.clear();
    console.log('open dialog');
    const dialogRef = this.dialog.open(DialogViewComponent, {
      width: '300px',
      data: {imgUrl: this.newImageUrl},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.newImageUrl = result;
      if (this.newImageUrl !== undefined && this.newImageUrl !== '') {
        if (this.acceptedFilesFormats.includes(result.split('.').pop().toLocaleLowerCase())) {
          this.form.value.imgUrl = this.newImageUrl;
          this.url = this.newImageUrl;
          this.hide = true;
          console.log(this.newImageUrl);
          return;
        }
        this.alertService.error('Uncorrected file format');
      }
    });
  }

  /*  onSelectFile(event: any) {
      this.alertService.clear();
      if (event.target.files && event.target.files[0]) {
        if((event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpeg"
        || event.target.files[0].type === "image/jpg") && event.target.files[0].size < 2000000){
          this.hide = true;
          const reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          let imgUrl = URL.createObjectURL(event.target.files[0]);
          reader.onload = (event: any) => {
            this.newImageUrl = imgUrl;
            this.form.value.imgUrl = this.newImageUrl;
            this.url = this.newImageUrl;
          }
          return;
        }
        this.alertService.error('Uncorrected file format');
      }
    }*/

  delete() {
    this.alertService.clear();
    this.hide = false
    this.url = this.oldImageUrl;
    this.form.value.imgUrl = this.oldImageUrl;
  }

  ngOnInit(): void {
    this.profileService.getProfileData()
      .pipe(takeUntil(this.destroy))
      .subscribe((data: Profile) => {
        this.profileData = {
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: data.birthDate,
          gender: data.gender,
          imgUrl: data.imgUrl
        };
        this.loading = false;
        console.log(data.birthDate);
        this.form.setValue({
          firstName: this.profileData.firstName,
          lastName: this.profileData.lastName,
          date: this.profileData.birthDate,
          gender: this.profileData.gender,
          imgUrl: this.profileData.imgUrl
        });
        this.oldImageUrl = this.profileData.imgUrl;
        this.url = this.oldImageUrl;
      });
  }

  submit() {
    this.hide = false
    this.alertService.clear();
    let profile: Profile = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      birthDate: this.form.value.date,
      gender: this.form.value.gender,
      imgUrl: this.form.value.imgUrl
    }
    this.profileService.saveChanges(profile)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success('Data changed',);
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
          this.alertService.error(this.alertMessage);
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

  back() {
    this.router.navigateByUrl('/profile');
  }
}
