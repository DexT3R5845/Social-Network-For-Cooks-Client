import {Component, OnDestroy, OnInit} from '@angular/core';
import {PasswordValidatorShared} from "../../account/sharedClass/passwordValidatorShared";
import {ReplaySubject, takeUntil} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MustMatch} from "../../_helpers";
import {AlertService} from "../../_services";
import {ProfileService} from "../../_services/profile.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends PasswordValidatorShared implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private alertService: AlertService, private profileService: ProfileService) {
    super();
    this.form = fb.group({
        password: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$')]),
        newPassword: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$')]),
        confirmPassword: new FormControl('', Validators.required)
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      });
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;
  loading = true;
  hide = true;

  ngOnInit(): void {
    this.loading=false;
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  get newPasswordErrorMessage(): string {
    return this.form.controls['newPassword'].hasError('required') ?
      'Enter your password, please' :
      this.control['password'].hasError('pattern') ?
        'The password contains at least 8 symbol, one uppercase letter, a lowercase letter, and a number' : '';
  }

  changePassword() {
    this.alertService.clear();
    this.profileService.changePassword(this.form.value.password, this.form.value.newPassword)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success('Password changed', false);
        },
        error: error => {
          switch(error.status){
            case 400:
              this.alertMessage = "Wrong old password";
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

}
