import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy {
  form: FormGroup;
  alertMessage: string;
  isInvalidData = false;
  isValidData = false;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService
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

onSubmit() {
  this.isInvalidData = false;
  this.isValidData = false;
  if (this.form.valid) {
    this.authService.forgotPassword(this.control['email'].value)
            .pipe(takeUntil(this.destroy))
            .subscribe({
                next: () => this.isValidData = true,
                error: error => {
                  switch(error.status){
                    case 400:
                      this.alertMessage = "Email format is invalid";
                      break;
                    case 404:
                      this.alertMessage = error.error.message;
                      break;
                      default:
                        this.alertMessage = "There was an error on the server, please try again later."
                        break;
                  }                  
                this.isInvalidData = true;}
            });
  }
}

}
