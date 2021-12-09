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
    this.form = this.formBuilder.group({
      id: [this.data.id],
      imgUrl: ['', [Validators.required, Validators.pattern('[^\s]+(.*?)\.(jpg|jpeg|png|JPG|JPEG|PNG)$')]],
      firstName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      lastName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      email: [null],
    });
  }

  onNoClick(): void {
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
          error: () => {
            this.alertService.error("There was an error on the server, please try again later.");
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
        next: (data: AccountInList) => {
        this.profile = data;
      },
        error: error => {
          switch(error.status){
            case 404:
              this.alertMessage = error.error.message;
              break;
            default:
              this.alertMessage = "There was an error on the server, please try again later."
              break;
          }
          this.alertService.error(this.alertMessage);
      }});
  }
}
