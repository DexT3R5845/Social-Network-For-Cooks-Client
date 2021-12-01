import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { first, ReplaySubject, takeUntil } from 'rxjs';

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
export class ResetPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;
  isInvalidData = false;
  isValidData = false;
  hide = true;
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token: string = "";

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private route: ActivatedRoute,
  private router: Router,
){
  this.form = this.formBuilder.group({
    password: [null, [Validators.required, Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}$')]],
    confirmPassword: ['', Validators.required]
  }, {
    validator: MustMatch('password', 'confirmPassword')
  });
}
  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

ngOnInit(){
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

get control(){return this.form.controls}

onSubmit() {
  this.isInvalidData = false;
  this.isValidData = false;
  this.alertMessage = "";
  if (this.form.valid) {
    this.authService.resetPassword(this.token, this.control['password'].value, this.control['confirmPassword'].value)
            .pipe(takeUntil(this.destroy))
            .subscribe({
                error: error => {
                  switch(error.status){
                    case 200:
                      this.isValidData = true;
                      setTimeout(() => { this.router.navigate(['../../signin'], { relativeTo: this.route }); }, 3000);
                      break;
                    case 400:
                      Object.keys(error.error.data).forEach(key => {
                        this.alertMessage += error.error.data[key];
                      });;
                      break;
                      default:
                        this.alertMessage = "There was an error on the server, please try again later."
                        break;
                  }  
                  if(error.status >= 400)                
                this.isInvalidData = true;}
            });
  }
}

}
