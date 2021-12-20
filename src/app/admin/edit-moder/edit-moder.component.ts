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
          this.alertService.error(error.error.message, false, false, "error-dialog");
      }});
  }

  close(): void {
    this.dialogRef.close();
  }

  editModerator(): void {
    if (this.form.valid) {
      const account: AccountInList = this.form.value;
      this.service.editModerator(account)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Account successfully updated.", true, true);
            this.dialogRef.close(account);
          },
          error: error => {
            this.alertService.error(error.error.message, false, false, "error-dialog");
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
