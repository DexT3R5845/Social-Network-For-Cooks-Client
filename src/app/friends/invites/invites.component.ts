import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable} from "@angular/material/table";
import {AccountInList} from "../../_models/account-in-list";
import {Page} from "../../_models/page";
import {ReplaySubject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {FriendService} from "../../_services/friend.service";
import {AlertService} from "../../_services";
import {SearchAccountParams} from "../../_models/search-account-params";

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<AccountInList>;
  pageContent: Page<AccountInList> = {content: [], totalElements: 0};
  pageSize: number = 12;
  alertMessage: string;
  currentPage: number;
  displayedColumns: string[] = ['image', 'firstName', 'lastName', 'action'];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  searchForm: FormGroup = new FormGroup({
    search: new FormControl("", Validators.pattern('^([A-Z a-z]){3,35}$')),
    order: new FormControl("asc"),
    gender: new FormControl("")
  });
  inviteSearch: SearchAccountParams;

  constructor(private service: FriendService, private alertService: AlertService) {
  }

  getInvites(): void {
    this.inviteSearch = {
      search: this.searchForm.value.search,
      order: this.searchForm.value.order,
      gender: this.searchForm.value.gender,
      status: ""
    }
    this.service.getInvitesBySearch(this.inviteSearch, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
        },
        error: () => {
          this.alertService.error("Unexpected error, try later",true,true);
        }
      });
  }

  acceptInvite(index: number, id: number): void {
    this.service.acceptInvite(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success("The invite has been accepted", true, true);
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

  declineInvite(index: number, id: number): void {
    this.service.declineInvite(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success("The invite has been declined", true, true);
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

  paginationHandler(pageEvent: PageEvent): void {
    this.alertService.clear();
    this.service.getInvitesByPageNum(pageEvent.pageIndex, pageEvent.pageSize)
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

  get searchParamErrorMessage(): string {
    return this.searchForm.controls['search'].hasError('required') ?
      'Please provide a valid name' :
      this.searchForm.controls['search'].hasError('pattern') ?
        'The name must contain only letters. Min length 3 characters' : '';
  }

  ngOnInit(): void {
    this.getInvites();
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
