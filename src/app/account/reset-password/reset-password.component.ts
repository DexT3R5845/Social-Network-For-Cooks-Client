import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { first } from 'rxjs';

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
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
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
    password: [null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$')]],
    confirmPassword: ['', Validators.required]
  }, {
    validator: MustMatch('password', 'confirmPassword')
  });
}

ngOnInit(){
  const token = this.route.snapshot.params['token'];
  this.authService.validateResetToken(token)
  .pipe(first())
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

get f(){return this.form.controls}

onSubmit() {
  this.isInvalidData = false;
  this.isValidData = false;
  this.alertMessage = "";
  if (this.form.valid) {
    this.authService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
            .pipe(first())
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
