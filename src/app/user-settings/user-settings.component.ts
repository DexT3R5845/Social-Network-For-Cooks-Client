import {Component, OnInit} from '@angular/core';
import {UserSettingsService} from "./user-settings.service";
import {UserUpdate} from "./user-update";
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  constructor(private userSettingsService: UserSettingsService) {
  }

  user: UserUpdate;
  settingsForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    date: new FormControl(),
    gender: new FormControl(),
    imgUrl: new FormControl()
  })
  subscription: Subscription;

  ngOnInit(): void {
    this.userSettingsService.getUserProfile().subscribe((data: any) => {
      this.user = new UserUpdate(data.firstName, data.lastName, data.birthDate, data.gender, data.imgUrl);
      this.settingsForm.setValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        date: this.user.birthDate,
        gender: this.user.getStringGender,
        imgUrl: this.user.imgUrl
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  submit() {
    let user = new UserUpdate(
      this.settingsForm.value.firstName,
      this.settingsForm.value.lastName,
      this.settingsForm.value.date,
      this.settingsForm.value.gender,
      this.settingsForm.value.imgUrl
    )
    this.userSettingsService.putData(user).subscribe();
  }
}
