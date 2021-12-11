import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/_services';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
  subscription : Subscription;
  message: any;
  @Input() id = 'default-alert';

  constructor(private alertService: AlertService) { }

  ngOnInit() {
      this.subscription = this.alertService.OnAlert(this.id)
          .subscribe(message => {
              switch (message && message.type) {
                  case 'success':
                      message.cssClass = 'alert alert-success';
                      break;
                  case 'error':
                      message.cssClass = 'alert alert-danger';
                      break;
              }

              this.message = message;

              if(message.autoClose)
                setTimeout(() => {
                    this.message = null;
                }, 3000);
          });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

}
