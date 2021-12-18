import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Observable, ReplaySubject} from "rxjs";
import {AlertService, DishService, IngredientService} from "../../_services";
import {Page} from "../../_models/page";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import { Dish } from 'src/app/_models/dish';
import { IngredientFilter } from 'src/app/_models/_filters/ingredient.filter';
import { DishIngredientFilter } from 'src/app/_models/dish-ingredient-filter';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { SearchDishParams } from 'src/app/_models/search-dish-params';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';


@Component({
  selector: 'app-dish-list-page',
  templateUrl: './dish-list-page.component.html',
  styleUrls: ['./dish-list-page.component.scss']
})
export class DishListPageComponent {
  pageContent: Page<Dish>;
  categories: string[] = [];
  ingredients: DishIngredientFilter[] = [];
  selectedIngredients: DishIngredientFilter[] = [];
  selectedIngredientsIds: string[] = [];
  filteredIngredients: Observable<DishIngredientFilter[]>;
  searchForm: FormGroup = this.createFormGroup();
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['image', 'name', 'category', 'type', 'description', 'actions'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;
  ingredientControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  isFilteredByStock: boolean;
  @ViewChild('ingredientInput') ingredientInput: ElementRef<HTMLInputElement>;

  constructor(
    private dishService: DishService,
    private ingredientService: IngredientService,
    private alertService: AlertService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder
  ) {
  }
  

  ngOnInit(): void {
    this.getIngredients("");
    this.getCategories();
    this.getBySearch(this.searchForm);
    this.filteredIngredients = this.ingredientControl.valueChanges.pipe(
      startWith(null),
      map((ingredient: string) => (ingredient ? this._filter(ingredient) : this.ingredients.slice())),
    );
    this.isFilteredByStock = false;
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

  private _filter(value: string): DishIngredientFilter[] {
    this.getIngredients(String(value));

    return this.ingredients;
  }


  getBySearch(searchForm: FormGroup): void {
    this.alertService.clear();
    const filter: SearchDishParams = searchForm.value;
    filter.ingredients = this.selectedIngredientsIds.toString();
    this.dishService.getDishesBySearch(searchForm.value, this.pageSize)
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
    this.getDishPage(pageEvent.pageIndex, pageEvent.pageSize);
  }

  private getDishPage(pageIndex: number, pageSize: number): void {
    this.alertService.clear();
    this.dishService.getDishesByPageNum(pageIndex, pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = pageIndex;
          this.pageSize = pageSize;
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
            this.categories.push(x);
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
            if(ingredient.id !== undefined && !(this.selectedIngredients.filter(i => i.id === ingredient.id).length > 0)) {
              this.ingredients.push({ name: ingredient.name, id: ingredient.id});
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

  onIngredientFilterChange() {
      this.getIngredients(this.searchForm.value.ingredientSearchInput);
  }

  remove(ingredient: DishIngredientFilter): void {
    const ingredientIndex = this.selectedIngredients.indexOf(ingredient);
    const indexIdIndex = this.selectedIngredientsIds.indexOf(ingredient.id);
    if (ingredientIndex >= 0) {
      this.selectedIngredients.splice(ingredientIndex, 1);
    }
    if (indexIdIndex >= 0) {
      this.selectedIngredientsIds.splice(indexIdIndex, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedIngredients.push(event.option.value);
    this.selectedIngredientsIds.push(event.option.value.id);
    this.ingredientInput.nativeElement.value = '';
    this.ingredientControl.setValue(null);
  }

  confirmDelete(id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.dishService.deleteDish(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success("Dish deleted",true,true);
          this.getDishPage(this.currentPage, this.pageSize);
        },
        error: error => {
          switch (error.status) {
            case 400:
              this.alertMessage = "Something went wrong";
              break;
            case 404:
              this.alertMessage = error.error.message;
              break;
            default:
              this.alertMessage = "There was an error on the server, please try again later."
              break;
          }
          this.alertService.error(this.alertMessage,true,true);
        }
      });
      }
    });
  }

  manageFilterByStock(event: MatCheckboxChange) : void {
    this.isFilteredByStock = event.source.checked;
    console.log(this.isFilteredByStock);
  }

}

