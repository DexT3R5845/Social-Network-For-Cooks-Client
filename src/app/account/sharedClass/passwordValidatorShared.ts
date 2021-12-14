import {FormGroup} from "@angular/forms";

export class PasswordValidatorShared {
  form: FormGroup;

  get control() {
    return this.form.controls;
  }

  get passwordErrorMessage(): string {
    return this.control['password'].hasError('required') ?
      'Enter your password, please' :
      this.control['password'].hasError('pattern') ?
        'The password contains at least 8 symbol, one uppercase letter, a lowercase letter, and a number' : '';
  }

  get confirmPasswordErrorMessage(): string {
    return this.control['confirmPassword'].hasError('required') ?
      'Enter your password, please' :
      this.control['confirmPassword'].hasError('mustMatch') ?
        'Passwords do not match' : '';
  }
}
