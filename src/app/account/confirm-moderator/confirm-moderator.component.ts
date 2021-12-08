import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject, takeUntil} from "rxjs";
import {PasswordValidatorShared} from "../sharedClass/passwordValidatorShared";
import {FormBuilder, Validators} from "@angular/forms";
import {AlertService, AuthService} from "../../_services";
import {ActivatedRoute, Router} from "@angular/router";
import {MustMatch} from "../../_helpers";

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}


@Component({
  selector: 'app-confirm-moderator',
  templateUrl: './confirm-moderator.component.html',
  styleUrls: ['./confirm-moderator.component.scss']
})

export class ConfirmModeratorComponent extends PasswordValidatorShared implements OnInit, OnDestroy {

  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;
  hide = true;
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
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
    });
  }
  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(){
    const token = this.route.snapshot.params['token'];
    this.authService.validateConfirmToken(token)
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

  onSubmit() {
    this.alertService.clear();
    this.alertMessage = "";
    if (this.form.valid) {
      this.authService.confirmModerator(this.token, this.control['password'].value, this.control['confirmPassword'].value)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: ()  => {
            this.alertService.success('Password creation successful, you can now login', true);
            this.router.navigate(['../../signin'], { relativeTo: this.route });
          },
          error: error => {
            switch(error.status){
              case 410:
                this.alertMessage = error.error.message;
                break;

              case 404:
                this.alertMessage = error.error.message;
                break;

              default:
                this.alertMessage = "There was an error on the server, please try again later.";
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
    }
  }

}
