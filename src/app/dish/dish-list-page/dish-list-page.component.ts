import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {ReplaySubject} from "rxjs";
import {AlertService, DishService, IngredientService} from "../../_services";
import {Page} from "../../_models/page";
import {takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import { Dish } from 'src/app/_models/dish';
import { DishCategory } from 'src/app/_models/dish-category';
import { IngredientFilter } from 'src/app/_models/_filters/ingredient.filter';
import { DishIngredientFilter } from 'src/app/_models/dish-ingredient-filter';


@Component({
  selector: 'app-dish-list-page',
  templateUrl: './dish-list-page.component.html',
  styleUrls: ['./dish-list-page.component.scss']
})
export class DishListPageComponent {
  pageContent: Page<Dish>;
  categories: DishCategory[] = [];
  ingredients: DishIngredientFilter[] = [];
  searchForm: FormGroup = this.createFormGroup();
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['image', 'name', 'category', 'type', 'description', 'actions'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;

  constructor(
    private dishService: DishService,
    private ingredientService: IngredientService,
    private alertService: AlertService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder
  ) {
  }

  private createFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      categories: [''],
      ingredients: [''],
      order: ['asc'],
      ingredientSearchInput: [''],
      active: ['']
    });
  }


  getBySearch(searchForm: FormGroup): void {
    this.alertService.clear();
    this.dishService.getDishBySearch(searchForm.value, this.pageSize)
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
    this.dishService.getDishByPageNum(pageEvent.pageIndex, pageEvent.pageSize)
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
    this.dishService.getAllCategories()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          response.forEach( x => {
            this.categories.push(new DishCategory(x));
          })
          },
          error: () => {
            this.alertService.error("There was an error on the server, please try again later.");
          }}
      )
  }

  getIngredients(searchText: string) {
    this.ingredients = [];
  const filter: IngredientFilter = {sortASC: true, sizePage: 10, status: true, sortBy: "",
   ingredientCategory: [], numPage: 0, searchText: searchText};
    this.ingredientService.getAll(filter)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          for (let ingredient of response.content) {
            if(ingredient.id !== undefined) {
              this.ingredients.push(new DishIngredientFilter(ingredient.name, ingredient.id));
            }
          }
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
    this.getIngredients("");
    this.getCategories();
    this.getBySearch(this.searchForm);

  }

  onIngredientFilterChange() {
      this.getIngredients(this.searchForm.value.ingredientSearchInput);
  }

}

