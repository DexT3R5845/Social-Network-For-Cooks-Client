import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {ReplaySubject} from "rxjs";
import {AccountInList} from "../../_models/account-in-list";
import {AdminService} from "../../_services/admin.service";
import {AlertService} from "../../_services";
import {takeUntil} from "rxjs/operators";
import {CreateModerComponent} from "../create-moder/create-moder.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {EditModerComponent} from "../edit-moder/edit-moder.component";
import {SearchAccountParams} from "../../_models/search-account-params";


@Component({
  selector: 'app-moder-list-page',
  templateUrl: './moder-list-page.component.html',
  styleUrls: ['./moder-list-page.component.scss']
})
export class ModerListPageComponent {
  pageContent: AccountInList[] = [];
  totalElements: number;
  searchForm: FormGroup = this.createFormGroup();
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['image', 'firstName', 'lastName', 'id', 'actions'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;

  constructor(
    private service: AdminService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) { }


  getBySearch(searchForm: FormGroup): void {
    this.alertService.clear();
    const searchParams : SearchAccountParams = searchForm.value;
    this.service.getAccountsBySearch(searchParams, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response.content;
          this.totalElements = response.totalElements;
          this.currentPage = 0;
          },
        error: () => {
          this.alertService.error("There was an error on the server, please try again later.", false, true);
          this.pageContent = [];
        }
      });
  }

  paginationHandler(pageEvent: PageEvent): void {
    this.alertService.clear();
    this.service.getAccountByPageNum(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response.content;
          this.totalElements = response.totalElements;
          this.currentPage = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
          },
        error: error => {
          this.alertService.error(error.error.message, false, true);
          this.pageContent = [];
        }
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CreateModerComponent, dialogConfig);
  }

  editModerator(account : AccountInList, id : string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataDialog = Object.assign({}, account);
    dialogConfig.data = {
      account: dataDialog,
      id : id
    };

    const dialogRef = this.dialog.open(EditModerComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: AccountInList) => {
      if(data){
        account.firstName = data.firstName;
        account.lastName = data.lastName;
        account.birthDate = data. birthDate;
        account.gender = data.gender;
        account.imgUrl = data.imgUrl;
      }
    })
  }


  changeStatus(index: number, id: string, status: boolean) {
    this.service.changeStatus(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.pageContent[index].status = !status;
        },
        error: error => {
          this.alertService.error(error.error.message, false, true);
        }
      }
      )
  }
}

