import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdminService} from "../../_services/admin.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {AccountInList} from "../../_models/account-in-list";

@Component({
  selector: 'app-edit-moder',
  templateUrl: './edit-moder.component.html',
  styleUrls: ['./edit-moder.component.scss']
})

export class EditModerComponent implements OnInit, OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  profile: AccountInList;
  alertMessage: string;

  constructor(
    public dialogRef: MatDialogRef<EditModerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountInList,
    public service: AdminService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.service.getById(this.data.id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (data: AccountInList) => {
        this.profile = data;
    this.form = this.formBuilder.group({
      id: [this.data.id],
      imgUrl: [this.profile.imgUrl, [Validators.required, Validators.pattern('[^\s]+(.*?)\.(jpg|jpeg|png|JPG|JPEG|PNG)$')]],
      firstName: [this.profile.firstName, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      lastName: [this.profile.lastName, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      birthDate: [this.profile.birthDate, Validators.required],
      gender: [this.profile.gender, Validators.required],
      email: [this.profile.email],
    });
      },
        error: error => {
          this.displayError(error);
      }});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editModerator(): void {
    if (this.form.valid) {
      this.service.editModerator(this.form)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: response => {
            this.alertService.success('Edit successful');
            console.log(response)
          },
          error: error => {
            this.displayError(error);
          }});
    }
  }
  
  displayError(error: any) : void {
    switch (error.status) {
      case 400:
        this.alertMessage = "Something went wrong";
        break;
      case 404:
        this.alertMessage = error.error.message;
        break;
      default:
        this.alertMessage = "There was an error on the server, please try again later."
        break;
    }
    this.alertService.error(this.alertMessage,true,true);
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
