import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import { first } from 'rxjs';
import { RegistrationService } from '../auth/registration.service';
import { Router } from '@angular/router';

import { User } from '../user';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  registerForm :any;

  get name(){return this.registerForm.get("name")}
  get surname(){return this.registerForm.get("surname")}
  get birthDate(){return this.registerForm.get("birthDate")}
  get gender(){return this.registerForm.get("gender")}
  get email(){return this.registerForm.get("email")}
  get password(){return this.registerForm.get("password")}
  //get confirmPassword(){return this.registerForm.get("confirmPassword")}
  


ngOnInit() {

  this.registerForm = new FormGroup({    

    "name": new FormControl("",[
      Validators.required,
       Validators.pattern('^([A-Z a-z]){8,35}$')
      ]),

    "surname": new FormControl("",[
      Validators.required,
       Validators.pattern('^([A-Z a-z]){8,35}$')
      ]),

    "birthDate": new FormControl("",[ 
        Validators.required
      ]),

    "gender": new FormControl("",[ 
        Validators.required
      ]),
  
    "email": new FormControl("", [
       Validators.required,
        Validators.email
      ]),
  
    "password": new FormControl("", [
      Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,35}$')
    ]),
  
    "confirmPassword": new FormControl("", [
      Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,35}$')
    ])
  });
}

constructor(private registrationService: RegistrationService, private router: Router){}



onSubmit() {
  let user = new User(
    this.registerForm.value.name,
    this.registerForm.value.surname,
    this.registerForm.value.birthDate,
    this.registerForm.value.gender,
    this.registerForm.value.email,
    this.registerForm.value.password,
    this.registerForm.value.confirmPassword
  )
  
   this.registrationService.signUp(user).pipe(first())
   .subscribe(response => {
     if (response.status = 200) {
       this.router.navigate(['/signin']);
     };

   console.log(this.registerForm.value);
});
}
}
