import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {AccountInList} from "../../_models/account-in-list";
import {AdminService} from "../../_services/admin.service";
import {AlertService} from "../../_services";

@Component({
  selector: 'app-moder-list-page',
  templateUrl: './moder-list-page.component.html',
  styleUrls: ['./moder-list-page.component.scss']
})
export class ModerListPageComponent implements OnDestroy {
  searchFormGroup: FormGroup = this.createFormGroup();
  accounts: AccountInList[] = [];
  currentPage: number;
  itemCount: number;
  pageSize: number = 12;
  subscription: Subscription;
  alertMessage: string;

  constructor(
    private service: AdminService,
    private alertService: AlertService,
  ) { }


  getBySearch(searchForm: FormGroup): void {
    this.subscription?.unsubscribe();
    this.subscription = this.service.getAccountsBySearch(searchForm, this.pageSize)
      .subscribe({
        next: response => {
          this.accounts = response.items;
          this.itemCount = response.itemCount;
          this.currentPage = 0;
          this.searchFormGroup = searchForm;},
        error: error => {
          if (error.status == 400) {
            this.alertMessage = "database error";
          } else {
            this.alertMessage = "unexpected error, try later";
          }
          this.alertService.error(this.alertMessage);}
      });
  }

  paginationHandler(pageEvent: PageEvent): void {
    this.subscription?.unsubscribe();
    this.subscription = this.service.getAccountByPageNum(pageEvent.pageIndex, pageEvent.pageSize)
      .subscribe({
        next: response => {
          this.accounts = response.items;
          this.pageSize = pageEvent.pageSize;
          this.currentPage = pageEvent.pageIndex;
          this.itemCount = response.itemCount;},
        error: error => {
          if (error.status == 400) {
            this.alertMessage = "database error";
          } else {
            this.alertMessage = "unexpected error, try later";
          }
          this.alertService.error(this.alertMessage);}
      });
  }


  createFormGroup(): FormGroup {
    return new FormGroup({
      "search": new FormControl(""),
      "order": new FormControl("asc"),
      "gender": new FormControl(""),
      "status": new FormControl("")
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

