import {Component, OnInit, ViewChild} from '@angular/core';
import {FriendService} from "../../_services/friend.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountInList} from "../../_models/account-in-list";
import {Page} from "../../_models/page";
import {finalize, ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {MatTable} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {SearchAccountParams} from "../../_models/search-account-params";

@Component({
  selector: 'app-view-friends',
  templateUrl: './view-friends.component.html',
  styleUrls: ['./view-friends.component.scss']
})
export class ViewFriendsComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<AccountInList>;
  pageContent: Page<AccountInList> = {content: [], totalElements: 0};
  pageSize: number = 12;
  alertMessage: string;
  currentPage: number;
  displayedColumns: string[] = ['image', 'firstName', 'lastName', 'delete'];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  searchForm: FormGroup = new FormGroup({
    search: new FormControl("", Validators.pattern('^([A-Z a-z]){3,35}$')),
    order: new FormControl("asc"),
    gender: new FormControl("")
  });
  friendSearch: SearchAccountParams;
  isLoadingResults = true;

  constructor(private service: FriendService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.friendSearch = {
      search: this.searchForm.value.search,
      order: this.searchForm.value.order,
      gender: this.searchForm.value.gender,
      status: ""
    }
    this.getFriendsBySearch();
  }

  getFriendsBySearch(): void {
    this.friendSearch = {
      search: this.searchForm.value.search,
      order: this.searchForm.value.order,
      gender: this.searchForm.value.gender,
      status: ""
    }
    this.service.getFriendsBySearch(this.friendSearch, this.pageSize)
      .pipe(takeUntil(this.destroy), finalize(() => this.isLoadingResults = false))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = 0;
        },
        error: () => {
          this.alertService.error("Unexpected error, try later", true, true);
        }
      })
  }

  paginationHandler(pageEvent: PageEvent): void {
    this.alertService.clear();
    this.service.getFriendsByPageNum(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
        },
        error: () => {
          this.alertService.error("Unexpected error, try later", true, true);
        }
      });
  }

  removeFriend(index: number, id: number): void {
    this.service.removeFried(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success("Friend deleted", true, true);
          this.pageContent.content.splice(index, 1);
          this.table.renderRows();
        },
        error: error => {
          switch (error.status) {
            case 400:
              this.alertMessage = "Something went wrong";
              break;
            case 404:
              this.alertMessage = error.error.message;
              break;
            default:
              this.alertMessage = "There was an error on the server, please try again later."
              break;
          }
          this.alertService.error(this.alertMessage, true, true);
        }
      });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.code === "Space") {
      event.preventDefault();
    }
  }

  get searchParamErrorMessage(): string {
    return this.searchForm.controls['search'].hasError('required') ?
      'Please provide a valid name' :
      this.searchForm.controls['search'].hasError('pattern') ?
        'The name must contain only letters. Min length 3 characters' : '';
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
