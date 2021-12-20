import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { AlertService } from 'src/app/_services';
import { AuthService } from 'src/app/_services/auth.service';
import { PasswordValidatorShared } from '../sharedClass/passwordValidatorShared';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends PasswordValidatorShared implements OnInit, OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;
  hide: boolean = true;
  hideConfirm: boolean = true;
  TokenStatus = TokenStatus;
  tokenStatus: TokenStatus = TokenStatus.Validating;
  token: string = "";

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private route: ActivatedRoute,
  private router: Router,
  private alertService: AlertService
){
  super();
  this.form = this.formBuilder.group({
    password: [null, [Validators.required, Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}$')]],
    confirmPassword: ['', Validators.required]
  }, {
    validator: MustMatch('password', 'confirmPassword')
  } as AbstractControlOptions
  );
}
  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

ngOnInit(): void{
  const token = this.route.snapshot.params['token'];
  this.authService.validateResetToken(token)
  .pipe(takeUntil(this.destroy))
  .subscribe({
      next: () => {
          this.token = token;
          this.tokenStatus = TokenStatus.Valid;
      },
      error: () => {
          this.tokenStatus = TokenStatus.Invalid;
      }
  });
}

onSubmit(): void {
  this.alertService.clear();
  this.alertMessage = "";
  if (this.form.valid) {
    this.authService.resetPassword(this.token, this.control['password'].value, this.control['confirmPassword'].value)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: ()  => {
          this.alertService.success('Password reset successful, you can now login', true);
          this.router.navigate(['../../signin'], { relativeTo: this.route });
        },
        error: error => {
          switch(error.status){
            case 400:
              Object.keys(error.error.data).forEach(key => {
                this.alertMessage += error.error.data[key];
              });
              break;
            default:
              this.alertMessage = "There was an error on the server, please try again later."
              break;
          }
          this.alertService.error(this.alertMessage);
        }});
    }
  }

}
