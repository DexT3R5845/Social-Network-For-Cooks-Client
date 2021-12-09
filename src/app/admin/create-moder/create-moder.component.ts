import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdminService} from "../../_services/admin.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {AccountInList} from "../../_models/account-in-list";

@Component({
  selector: 'app-create-moder',
  templateUrl: './create-moder.component.html',
  styleUrls: ['./create-moder.component.scss']
})
export class CreateModerComponent implements OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  alertMessage: string;

  constructor(
    public dialogRef: MatDialogRef<CreateModerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountInList,
    public service: AdminService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.form = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      lastName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      imgUrl: [null, [Validators.required, Validators.pattern('[^\s]+(.*?)\.(jpg|jpeg|png|JPG|JPEG|PNG)$')]],
      birthDate: ['', Validators.required],
      email: ['', Validators.email],
      gender: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    if (this.form.valid) {
      this.service.addModerator(this.form)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success('Creation successful');
          },
          error: error => {
            switch(error.status){
              case 403:
                this.alertMessage = error.error.message;
                break;
              case 409:
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

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
