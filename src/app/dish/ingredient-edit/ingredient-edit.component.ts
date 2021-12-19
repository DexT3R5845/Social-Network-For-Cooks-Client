import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { finalize, merge, ReplaySubject, takeUntil } from 'rxjs';
import { Ingredient, ingredientCategory, Stock } from 'src/app/_models';
import { IngredientFilter } from 'src/app/_models/_filters';
import { AlertService, IngredientService, StockService } from 'src/app/_services';

@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrls: ['./ingredient-edit.component.scss']
})
export class IngredientEditComponent implements AfterViewInit, OnDestroy {
  formFilter: FormGroup;
  displayedColumns = ['image', 'name', 'ingredientCategory', 'actions'];
  dataSource: Ingredient[] = [];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isLoadingResults = true;
  resultsLength = 0;
  listCategory: ingredientCategory[];
  selectedIngredients: Ingredient[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialogRef: MatDialogRef<IngredientEditComponent>,
    private ingredientService: IngredientService, 
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data: any) {
      this.listCategory = data.listCategoryIngredient;
      this.selectedIngredients = data.selectedIngredients;
      this.formFilter = this.formBuilder.group({
      searchText: [],
      status: [],
      ingredientCategories: [],
    });
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
  const ingredientFilter: IngredientFilter = {
    sortASC: this.sort.direction == 'asc', sortBy: this.sort.active, ingredientCategory: this.ingredientCategories, searchText: this.searchText,
     numPage: this.paginator.pageIndex, sizePage: this.paginator.pageSize, status: true
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

  addIngredient(ingredient: Ingredient){
    ingredient.amount = 1;
    this.selectedIngredients.push(ingredient);
  }

  cancelAddIngredient(ingredientId: string){
    this.selectedIngredients = this.selectedIngredients.filter(u => u.id !== ingredientId);
  }

  get filterControl(){
    return this.formFilter.controls;
  }

  get searchText(){
    return this.filterControl['searchText'].value;
  }

  get ingredientCategories(){
    return this.formFilter.controls['ingredientCategories'].value
  }

  checkSelectedIngredient(id: string): boolean {
    return this.selectedIngredients.some(ingr => ingr.id == id);
  }

  close(): void{
    this.dialogRef.close(this.selectedIngredients);
  }

}
