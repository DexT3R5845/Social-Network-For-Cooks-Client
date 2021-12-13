import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { finalize, merge, ReplaySubject, takeUntil } from 'rxjs';
import { Ingredient, ingredientCategory, Stock } from 'src/app/_models';
import { StockFilter } from 'src/app/_models/_filters';
import { AlertService, IngredientService, StockService } from 'src/app/_services';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  formFilter: FormGroup;
  displayedColumns = ['image', 'name', 'ingredientCategory', 'amount', 'actions'];
  dataSource: Stock[] = [];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isLoadingResults = true;
  resultsLength = 0;
  listCategory: ingredientCategory[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private ingredientService : IngredientService,
              private stockService: StockService,
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

loadData(){
  const ingredientFilter: StockFilter = {
    sortASC: this.sort.direction == 'asc', sortBy: this.sort.active, ingredientCategory: this.ingredientCategories, searchText: this.searchText,
     numPage: this.paginator.pageIndex, sizePage: this.paginator.pageSize
  }
  this.isLoadingResults = true;
  this.stockService.getAll(ingredientFilter).pipe(takeUntil(this.destroy),
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

  editIngredient(stockItem: Stock){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataDialog = Object.assign({}, stockItem);
    dialogConfig.data = dataDialog;

    const dialogRef = this.dialog.open(EditComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Stock) => {
      if(data){
        stockItem.amount = data.amount;
      }
    })
  }

  addIngredient(){
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = this.listCategory;

    // this.dialog.open(AddComponent, dialogConfig);
  }

  deleteIngredient(ingredient: Ingredient){
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = Object.assign({}, ingredient);
  
    // const dialogRef = this.dialog.open(DeleteComponent, dialogConfig);
    // dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Ingredient) => {
    //   if(data){
    //     ingredient.active = data.active;
    //   }
    // })
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
  
}
