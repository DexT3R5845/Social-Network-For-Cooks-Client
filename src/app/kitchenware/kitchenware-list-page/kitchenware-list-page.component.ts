import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {ReplaySubject} from "rxjs";
import {AlertService} from "../../_services";
import {Page} from "../../_models/page";
import {takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {KitchenwareService} from "../../_services/kitchenware.service";
import {Kitchenware} from "../../_models/kitchenware";
import {CreateModerComponent} from "../../admin/create-moder/create-moder.component";
import {Profile} from "../../_models/profile";
import {EditModerComponent} from "../../admin/edit-moder/edit-moder.component";
import {EditKitchenwareComponent} from "../edit-kitchenware/edit-kitchenware.component";
import {CreateKitchenwareComponent} from "../create-kitchenware/create-kitchenware.component";
import {KitchenwareCategory} from "../../_models/kitchenware-category";


@Component({
  selector: 'app-moder-list-page',
  templateUrl: './kitchenware-list-page.component.html',
  styleUrls: ['./kitchenware-list-page.component.scss']
})
export class KitchenwareListPageComponent {
  pageContent: Page<Kitchenware>;
  categories: KitchenwareCategory[] = [];
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
    this.service.getKitchenwareBySearch(searchForm, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = 0;
          console.log("got search " + response.totalElements + " " + response.content);
          console.log("got search " + this.pageContent.totalElements + " " + this.currentPage);
        },
        error: () => {
          this.alertService.error("unexpected error, try later");}
      });
  }

  paginationHandler(pageEvent: PageEvent): void {
    this.alertService.clear();
    this.service.getKitchenwareByPageNum(pageEvent.pageIndex, pageEvent.pageSize)
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

  getCategories() {
    this.service.getAllCategories()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          response.forEach( x => {
            this.categories.push(new KitchenwareCategory(x));
          })
          },
          error: () => {
            this.alertService.error("There was an error on the server, please try again later.");
          }}
      )
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.getCategories();
    console.log("got categories");
    this.getBySearch(this.searchForm);
    console.log("got search");

  }


  changeStatus(index: number, id: string, active: boolean): void {
    this.alertService.clear();
    this.service.changeStatus(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
          next: () => {
            this.pageContent.content[index].active = !active;
          },
          error: error => {
            if (error.status == 404) {
              this.alertMessage = error.error.message;
            } else {
              this.alertMessage = "unexpected error, try later";
            }
            this.alertService.error(this.alertMessage);
          }
        }
      )
  }

  newKitchenware() {
    this.alertService.clear();
    this.dialog.open(CreateKitchenwareComponent, {data: { profile: Kitchenware}});
  }

  editKitchenware(index: number, id: string){
    this.alertService.clear();
    this.dialog.open(EditKitchenwareComponent, {data: {profile: Kitchenware, id: id}})
  }
}

