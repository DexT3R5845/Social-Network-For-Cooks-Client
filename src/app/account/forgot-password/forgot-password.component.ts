import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/_services';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy {
  form: FormGroup;
  alertMessage: string;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private alertService: AlertService
){
  this.form = this.formBuilder.group({
    email: ['', Validators.email]
  });
}
  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

get control(){return this.form.controls}

onSubmit(): void {
  this.alertService.clear();
  if (this.form.valid) {
    this.authService.forgotPassword(this.control['email'].value)
            .pipe(takeUntil(this.destroy))
            .subscribe({
                next: () => this.alertService.success("A letter with instructions has been sent to your email."),
                error: error => {
                  switch(error.status){
                    case 400:
                      this.alertMessage = "Email format is invalid";
                      break;
                    case 404:
                      this.alertMessage = `Account ${this.control['email'].value} not found.`;
                      break;
                      default:
                        this.alertMessage = "There was an error on the server, please try again later."
                        break;
                  }                  
                this.alertService.error(this.alertMessage);}
            });
    }
  }
}
