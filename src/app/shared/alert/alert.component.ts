import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertMessage, TypeAlert } from 'src/app/_models/alert.message';
import { AlertService } from 'src/app/_services';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
  subscription : Subscription;
  alertMessage: AlertMessage | null;
  @Input() id: string = 'default-alert';

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
      this.subscription = this.alertService.OnAlert(this.id)
          .subscribe(message => {
              this.alertMessage = message;
              if(this.alertMessage && this.alertMessage.autoClose)
                setTimeout(() => {
                    this.alertMessage = null;
                }, 3000);
          });
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

}
