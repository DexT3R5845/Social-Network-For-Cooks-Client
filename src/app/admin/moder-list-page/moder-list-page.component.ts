import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {ReplaySubject} from "rxjs";
import {AccountInList} from "../../_models/account-in-list";
import {AdminService} from "../../_services/admin.service";
import {AlertService} from "../../_services";
import {AccountsPerPage} from "../../_models/accounts-per-page";
import {takeUntil} from "rxjs/operators";
import {CreateModerComponent} from "../create-moder/create-moder.component";
import {MatDialog} from "@angular/material/dialog";
import {Profile} from "../../_models/profile";
import {EditModerComponent} from "../edit-moder/edit-moder.component";


@Component({
  selector: 'app-moder-list-page',
  templateUrl: './moder-list-page.component.html',
  styleUrls: ['./moder-list-page.component.scss']
})
export class ModerListPageComponent {
  pageContent: AccountsPerPage<AccountInList>;
  searchForm: FormGroup = this.createFormGroup();
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['image', 'firstName', 'lastName', 'id', 'actions'];
  pageSize: number = 12;
  alertMessage: string;

  constructor(
    private service: AdminService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) { }


  getBySearch(searchForm: FormGroup): void {
    this.service.getAccountsBySearch(searchForm, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          },
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
    this.service.getAccountByPageNum(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.pageSize = pageEvent.pageSize;
          },
        error: error => {
          if (error.status == 400) {
            this.alertMessage = "database error";
          } else {
            this.alertMessage = "unexpected error, try later";
          }
          this.alertService.error(this.alertMessage);}
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.getBySearch(this.searchForm);
  }

  private createFormGroup(): FormGroup {
    return new FormGroup({
      "search": new FormControl(""),
      "order": new FormControl("asc"),
      "gender": new FormControl(""),
      "status": new FormControl("")
    });
  }

  newModerator() {
    this.dialog.open(CreateModerComponent, {data: { profile: Profile }});
  }

  editModerator(index: number, id: string){
    this.dialog.open(EditModerComponent, {data: {profile: Profile, id: id}})
  }


  changeStatus(index: number, id: string, status: boolean) {
    this.service.changeStatus(id, status)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.pageContent.items[index].status = !status;
        },
        error: error => {
          if (error.status == 400) {
            this.alertMessage = "no such id in database";
          } else {
            this.alertMessage = "unexpected error, try later";
          }
          this.alertService.error(this.alertMessage);
        }
      }
      )
  }
}

