import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject, takeUntil, finalize, merge } from 'rxjs';
import { Ingredient } from 'src/app/_models';
import { ingredientCategory } from 'src/app/_models/ingredient.category';
import { IngredientFilter } from 'src/app/_models/_filters/ingredient.filter';
import { AlertService, IngredientService } from 'src/app/_services';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  formFilter: FormGroup;
  displayedColumns = ['image', 'name', 'ingredientCategory', 'actions'];
  dataSource: Ingredient[] = [];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isLoadingResults = true;
  resultsLength = 0;
  listCategory: ingredientCategory[];

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

  OnSubmitFilter(){
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  get filterControl(){
    return this.formFilter.controls;
  }

  get searchText(){
    return this.filterControl['searchText'].value;
  }

  get filterStatus(){
    return this.filterControl['status'].value;
  }

  get ingredientCategories(){
    return this.formFilter.controls['ingredientCategories'].value
  }

loadData(){
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

  loadCategory(){
    this.ingredientService.getAllIngredientCategory().pipe(takeUntil(this.destroy))
    .subscribe({
      next: data => this.listCategory = data,
      error: () => this.listCategory = []
    });
  }

  editIngredient(ingredient: Ingredient){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataDialog = Object.assign({}, ingredient);
    dialogConfig.data = {
      ingredient: dataDialog,
      listCategories: this.listCategory
    };

    const dialogRef = this.dialog.open(EditComponent, { data: { ingredient: dataDialog, listCategories: this.listCategory } });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Ingredient) => {
      if(data){
        ingredient.name = data.name;
        ingredient.active = data.active;
        ingredient.ingredientCategory = data. ingredientCategory;
        ingredient.imgUrl = data.imgUrl;
      }
    })
  }
}

