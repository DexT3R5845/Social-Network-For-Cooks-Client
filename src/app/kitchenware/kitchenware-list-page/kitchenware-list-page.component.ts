import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {ReplaySubject} from "rxjs";
import {AlertService} from "../../_services";
import {takeUntil} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {KitchenwareService} from "../../_services/kitchenware.service";
import {Kitchenware} from "../../_models/kitchenware";
import {EditKitchenwareComponent} from "../edit-kitchenware/edit-kitchenware.component";
import {CreateKitchenwareComponent} from "../create-kitchenware/create-kitchenware.component";
import {SearchKitchenwareParams} from "../../_models/search-kitchenware-params";


@Component({
  selector: 'app-kitchenware-list-page',
  templateUrl: './kitchenware-list-page.component.html',
  styleUrls: ['./kitchenware-list-page.component.scss']
})
export class KitchenwareListPageComponent {
  pageContent: Kitchenware[] = [];
  totalElements: number;
  categories: string[] = [];
  searchForm: FormGroup = this.createFormGroup();
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['image', 'name', 'category', 'actions'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;

  constructor(
    private service: KitchenwareService,
    private alertService: AlertService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder
  ) {
  }

  private createFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      categories: [''],
      order: ['asc'],
      active: ['']
    });
  }


  getBySearch(searchForm: FormGroup): void {
    this.alertService.clear();
    const searchParams: SearchKitchenwareParams = searchForm.value;
    this.service.getKitchenwareBySearch(searchParams, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response.content;
          this.totalElements = response.totalElements;
          this.currentPage = 0;
        },
        error: () => {
          this.pageContent = [];
          this.alertService.error("There was an error on the server, please try again later.", false, true);

        }
      });
  }

  paginationHandler(pageEvent: PageEvent): void {
    this.alertService.clear();
    this.service.getKitchenwareByPageNum(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response.content;
          this.totalElements = response.totalElements;
          this.currentPage = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
        },
        error: () => {
          this.pageContent = [];
          this.alertService.error("There was an error on the server, please try again later.", false, true);
        }
      });
  }

  getCategories() {
    this.service.getAllCategories()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          this.categories = response;
          },
          error: () => {
            this.alertService.error("There was an error on the server, please try again later.", false, true);
            this.categories = [];
          }}
      )
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.getCategories();
    this.getBySearch(this.searchForm);
  }


  changeStatus(index: number, id: string, active: boolean): void {
    this.alertService.clear();
    this.service.changeStatus(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
          next: () => {
            this.pageContent[index].active = !active;
          },
          error: error => {
            if (error.status == 404) {
              this.alertService.error(error.error.message, false, true);

            } else {
              this.alertService.error("There was an error on the server, please try again later.", false, true);

            }
          }
        }
      )
  }

  newKitchenware() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.categories;

    this.dialog.open(CreateKitchenwareComponent, dialogConfig);
  }

  editKitchenware(kitchenware: Kitchenware){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataDialog = Object.assign({}, kitchenware);
    dialogConfig.data = {
      kitchenware: dataDialog,
      categories: this.categories
    };
    const dialogRef = this.dialog.open(EditKitchenwareComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Kitchenware) => {
      if(data){
        kitchenware.name = data.name;
        kitchenware.category = data.category;
        kitchenware.imgUrl = data.imgUrl;
      }
    })
  }

}

