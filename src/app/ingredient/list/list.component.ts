import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject, takeUntil, finalize, merge } from 'rxjs';
import { Ingredient } from 'src/app/_models';
import { IngredientFilter } from 'src/app/_models/_filters/ingredient.filter';
import { AlertService, IngredientService } from 'src/app/_services';
import { DeleteComponent } from '../delete/delete.component';
import { AddEditComponent } from '../add-edit/add-edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  formFilter: FormGroup;
  displayedColumns: string[] = ['image', 'name', 'ingredientCategory', 'actions'];
  dataSource: Ingredient[] = [];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isLoadingResults: boolean = true;
  resultsLength: number = 0;
  listCategory: string[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private ingredientService : IngredientService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private alertService: AlertService) {
    this.formFilter = this.formBuilder.group({
      searchText: [],
      status: [],
      ingredientCategories: [],
    });
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  ngAfterViewInit(): void {
    this.loadData();
    this.sort.sortChange.pipe(takeUntil(this.destroy)).subscribe(() => this.paginator.pageIndex = 0);
   merge(this.sort.sortChange, this.paginator.page).pipe(takeUntil(this.destroy)).subscribe(() => this.loadData());
 }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  OnSubmitFilter(): void {
    this.paginator.pageIndex = 0;
    this.loadData();
  }

loadData(): void {
  const ingredientFilter: IngredientFilter = {
    sortASC: this.sort.direction == 'asc', sortBy: this.sort.active, ingredientCategory: this.ingredientCategories, searchText: this.searchText,
     numPage: this.paginator.pageIndex, sizePage: this.paginator.pageSize, status: this.filterStatus
  }
  this.isLoadingResults = true;
  this.ingredientService.getAll(ingredientFilter).pipe(takeUntil(this.destroy),
  finalize(() => this.isLoadingResults = false)).subscribe({
  next: data => {
      this.resultsLength = data.totalElements;
      this.dataSource = data.content;
      const matTable= document.getElementById('table');
      if(matTable)
        matTable.scrollIntoView();
  },
  error: ()=> {
  this.dataSource = [];
  }
  });
}

  loadCategory(): void {
    this.ingredientService.getAllIngredientCategory().pipe(takeUntil(this.destroy))
    .subscribe({
      next: data => this.listCategory = data,
      error: () => this.listCategory = []
    });
  }

  editIngredient(ingredient: Ingredient): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    let dataDialog = Object.assign({}, ingredient);
    dialogConfig.data = {
      ingredient: dataDialog,
      listCategories: this.listCategory
    };

    const dialogRef = this.dialog.open(AddEditComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Ingredient) => {
      if(data){
        ingredient.name = data.name;
        ingredient.active = data.active;
        ingredient.ingredientCategory = data. ingredientCategory;
        ingredient.imgUrl = data.imgUrl;
      }
    })
  }

  addIngredient(): void {
    let ingredient: Ingredient = {
      name: '',
      imgUrl: '',
      ingredientCategory: '',
      active: true
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      ingredient: ingredient,
      listCategories: this.listCategory
    };
    this.dialog.open(AddEditComponent, dialogConfig);
  }

  deleteIngredient(ingredient: Ingredient): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {...ingredient};
  
    const dialogRef = this.dialog.open(DeleteComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Ingredient) => {
      if(data){
        ingredient.active = data.active;
      }
    })
  }

  get filterControl(){
    return this.formFilter.controls;
  }

  get searchText(): string{
    return this.filterControl['searchText'].value;
  }

  get filterStatus(): boolean {
    return this.filterControl['status'].value;
  }

  get ingredientCategories(): string[]{
    return this.formFilter.controls['ingredientCategories'].value
  }
}

