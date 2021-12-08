import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {ReplaySubject} from "rxjs";
import {AccountInList} from "../../_models/account-in-list";
import {AdminService} from "../../_services/admin.service";
import {AlertService} from "../../_services";
import {Page} from "../../_models/page";
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
  pageContent: Page<AccountInList>;
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
    this.service.getAccountsBySearch(searchForm, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = 0;
          },
        error: () => {
          this.alertService.error("unexpected error, try later");}
      });
  }

  paginationHandler(pageEvent: PageEvent): void {
    this.alertService.clear();
    this.service.getAccountByPageNum(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
          },
        error: () => {
          this.alertService.error("unexpected error, try later");}
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
    this.alertService.clear();
    this.dialog.open(CreateModerComponent, {data: { profile: Profile }});
  }

  editModerator(index: number, id: string){
    this.alertService.clear();
    this.dialog.open(EditModerComponent, {data: {profile: Profile, id: id}})
  }


  changeStatus(index: number, id: string, status: boolean) {
    this.alertService.clear();
    this.service.changeStatus(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.pageContent.content[index].status = !status;
        },
        error: error => {
          if (error.status == 404) {
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

