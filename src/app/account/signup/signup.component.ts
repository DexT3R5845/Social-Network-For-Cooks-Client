import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  alertMessage: string;
  isInvalidData = false;
  isValidData = false;
  hide = false;

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private route: ActivatedRoute,
  private router: Router,
){
  this.form = this.formBuilder.group({
    firstName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
    lastName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
    birthDate: ['', Validators.required],
    email: ['', Validators.email],
    password: [null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$')]],
    confirmPassword: ['', Validators.required],
    gender: ['', Validators.required]
  }, {
    validator: MustMatch('password', 'confirmPassword')
  });
}

get firstNameErrorMessage(): string {
  return this.f['firstName'].hasError('required') ?
    'Please provide a valid name' :
    this.f['firstName'].hasError('pattern') ?
    'The name must contain only letters. Min length 3 characters' : '';
}

ngOnInit(){
}

get f(){return this.form.controls}

onSubmit() {
  this.isInvalidData = false;
  this.isValidData = false;
  if (this.form.valid) {
    this.authService.signUp(this.form.value)
            .pipe(first())
            .pipe(finalize(() => ""))
            .subscribe({
                error: error => {
                  switch(error.status){
                    case 200:
                      this.isValidData = true;
                      setTimeout(() => { this.router.navigate(['../signin'], { relativeTo: this.route }); }, 3000);
                      break;
                    case 400:
                      this.alertMessage = "Somethig went wrong";
                      break;
                    case 409:
                      this.alertMessage = error.error.message;
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
