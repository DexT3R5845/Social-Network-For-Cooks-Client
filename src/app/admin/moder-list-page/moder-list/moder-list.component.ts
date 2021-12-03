import {Component, Input} from '@angular/core';
import {AccountInList} from "../../../_models/account-in-list";

@Component({
  selector: 'app-moder-list',
  templateUrl: './moder-list.component.html',
  styleUrls: ['./moder-list.component.scss']
})
export class ModerListComponent {
  @Input() accounts: AccountInList[];
  columnsToDisplay = ['image', 'firstName', 'lastName', 'id', 'editBtn', 'status'];
}

