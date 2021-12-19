import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Dish, Ingredient, ingredientCategory, NewKitchenware } from 'src/app/_models';
import { AlertService, DishService, IngredientService } from 'src/app/_services';
import { IngredientEditComponent } from '../ingredient-edit/ingredient-edit.component';
import { KitchenwareEditComponent } from '../kitchenware-edit/kitchenware-edit.component';
import { DishFormError } from './dish-form-error';

@Component({
  selector: 'app-dish-add',
  templateUrl: './dish-add.component.html',
  styleUrls: ['./dish-add.component.scss']
})
export class DishAddComponent extends DishFormError implements OnInit {

listSelectedIngredients: Ingredient[] = [];
listSelectedKitchenware: NewKitchenware[] = [];
displayedColumns: string[] = ['image', 'name', 'amount', 'actions'];
listCategoryIngredient: ingredientCategory[] = [];
listCategoryKitchenware: string[] = [];
listCategoryDish: string[] = [];
destroy: ReplaySubject<any> = new ReplaySubject<any>();
dishModel: Dish;

  constructor(
    private dialog: MatDialog,
    private ingredientService: IngredientService,
    private dishService: DishService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    super();
    this.form = this.formBuilder.group({
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      dishCategory: ['', [Validators.required, Validators.maxLength(30)]],
      dishName: ['', [Validators.required, Validators.maxLength(30)]],
      dishType: ['', [Validators.required, Validators.maxLength(30)]],
      imgUrl: ['', [Validators.required, Validators.maxLength(300)]],
      receipt: ['', [Validators.required, Validators.maxLength(3000)]]
    });
  }

  ngOnInit(): void {
    this.loadCategoryIngredients();
    this.loadCategoryDish();
  }

  addIngredient(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = { 
      listCategoryIngredient: this.listCategoryIngredient,
      selectedIngredients: this.listSelectedIngredients
    }
    const dialogRef = this.dialog.open(IngredientEditComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Ingredient[]) => this.listSelectedIngredients = [...data]);
    console.log(this.listSelectedIngredients);
  }

  addKitchenware(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = { 
      listCategoryKitchenware: this.listCategoryKitchenware,
      selectedKitchenware: this.listSelectedKitchenware
    }
    const dialogRef = this.dialog.open(KitchenwareEditComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: NewKitchenware[]) => this.listSelectedKitchenware = [...data]);
  }

  loadCategoryIngredients(){
    this.ingredientService.getAllIngredientCategory().pipe(takeUntil(this.destroy))
    .subscribe({
      next: data => this.listCategoryIngredient = data,
      error: () => this.listCategoryIngredient = []
    });
  }

  loadCategoryDish(): void{
    this.dishService.getAllCategories().pipe(takeUntil(this.destroy)).subscribe({
      next: data => this.listCategoryDish = data,
      error: () => this.listCategoryDish = []
    });
  }

  removeIngredient(id: string){
    this.listSelectedIngredients = this.listSelectedIngredients.filter(u => u.id != id);
  }

  removeKitchenware(id: string){
    this.listSelectedKitchenware = this.listSelectedKitchenware.filter(u => u.id != id);
  }

  onSubmitForm(){
    this.alertService.clear();
    if(!this.listSelectedIngredients.length || !this.listSelectedKitchenware.length){
      console.log(this.listSelectedKitchenware);
      this.alertService.error("You forgot to choose the ingredients or kitchenware for the dish.", false, false, "formDish");
    }
    else if(this.form.valid){
      this.dishModel = {description: this.description, dishCategory: this.dishCategory, dishName: this.dishName, dishType: this.dishType,
      imgUrl: this.imgUrl, ingredients: this.listSelectedIngredients, kitchenwares: this.listSelectedKitchenware, receipt: this.receipt};
      this.dishService.createDish(this.dishModel).pipe(takeUntil(this.destroy)).subscribe({
        next: () => {
          this.alertService.success("Dish successfully added!", true);
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        },
        error: () => this.alertService.error("There was a server error. Please try again later.", false, false, "formDish")
      });
    }
  }

  onAmountChange(event: Event, ingredient: Ingredient){
    if((<HTMLInputElement>event.target).value === ""){
      (<HTMLInputElement>event.target).value = "1";
    }
    ingredient.amount = Number((<HTMLInputElement>event.target).value);
  }

}
