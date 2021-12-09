import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdminService} from "../../_services/admin.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Profile} from "../../_models/profile";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";

@Component({
  selector: 'app-edit-moder',
  templateUrl: './edit-moder.component.html',
  styleUrls: ['./edit-moder.component.scss']
})

export class EditModerComponent implements OnInit, OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  profile: Profile;
  alertMessage: string;

  constructor(
    public dialogRef: MatDialogRef<EditModerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Profile,
    public service: AdminService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.form = this.formBuilder.group({
      id: [this.data.id],
      firstName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      lastName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.profile.id = '0';
    this.dialogRef.close();
  }

  public editModerator(): void {
    if (this.form.valid) {
      this.service.editModerator(this.form)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success('Edit successful');
          },
          error: error => {
            switch(error.status){
              case 400:
                this.alertMessage = "Something went wrong";
                break;
              case 409:
                this.alertMessage = "Email is not unique";
                break;
              case 401:
                this.alertMessage = "Invalid email supplied";
                break;
              default:
                this.alertMessage = "There was an error on the server, please try again later."
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.service.getById(this.data.id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (data: Profile) => {
        this.profile = data;
      },
        error: error => {
          switch(error.status){
            case 404:
              this.alertMessage = "no accounts found with such id";
              break;
            default:
              this.alertMessage = "There was an error on the server, please try again later."
              break;
          }
          this.alertService.error(this.alertMessage);
      }});
  }
}
