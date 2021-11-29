import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, first } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  form: FormGroup;
  alertMessage: string;
  isInvalidData = false;
  isValidData = false;
  hide = false;

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService
){
  this.form = this.formBuilder.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  });
}

ngOnInit(){
}

get f(){return this.form.controls}

onSubmit() {
  this.isInvalidData = false;
  this.isInvalidData = false;
  if (this.form.valid) {
    this.authService.forgotPassword(this.f['email'].value)
            .pipe(first())
            .pipe(finalize(() => ""))
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
