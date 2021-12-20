import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Dish, Ingredient, NewKitchenware } from 'src/app/_models';
import { AlertService, DishService, IngredientService } from 'src/app/_services';
import { KitchenwareService } from 'src/app/_services/kitchenware.service';
import { IngredientEditComponent } from '../ingredient-edit/ingredient-edit.component';
import { KitchenwareEditComponent } from '../kitchenware-edit/kitchenware-edit.component';
import { DishFormError } from './dish-form-error';

@Component({
  selector: 'app-dish-add-edit',
  templateUrl: './dish-add-edit.component.html',
  styleUrls: ['./dish-add-edit.component.scss']
})
export class DishAddEditComponent extends DishFormError implements OnInit {

displayedColumns: string[] = ['image', 'name', 'amount', 'actions'];
listCategoryIngredient: string[] = [];
listCategoryKitchenware: string[] = [];
listCategoryDish: string[] = [];
destroy: ReplaySubject<any> = new ReplaySubject<any>();
dishModel: Dish;
title: string;
modeEdit: boolean = false;

  constructor(
    private dialog: MatDialog,
    private ingredientService: IngredientService,
    private dishService: DishService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private kitchenwareService: KitchenwareService
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
    const id = this.activatedRoute.snapshot.params['id'];
    if(id){
      this.modeEdit = true;
      this.dishService.getDishById(id).pipe(takeUntil(this.destroy)).subscribe({
        next: (data: Dish) => {this.dishModel = data; this.dishModel.id = id},
        error: () => this.router.navigate(['/dishes'])
    });
    }
    else {
      this.dishModel = { description: "", dishName: "", dishCategory: "", dishType: "", imgUrl: "", ingredients: [], kitchenwares: [], receipt: "" }
    }
    this.title = this.modeEdit ? "Edit Dish" : "Create New Dish";
    this.loadCategoryIngredients();
    this.loadCategoryDish();
    this.loadKitchenwareCategory();
  }

  addIngredient(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = { 
      listCategoryIngredient: this.listCategoryIngredient,
      selectedIngredients: this.dishModel.ingredients
    }
    const dialogRef = this.dialog.open(IngredientEditComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Ingredient[]) => this.dishModel.ingredients = [...data]);
  }

  addKitchenware(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = { 
      listCategoryKitchenware: this.listCategoryKitchenware,
      selectedKitchenware: this.dishModel.kitchenwares
    }
    const dialogRef = this.dialog.open(KitchenwareEditComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: NewKitchenware[]) => this.dishModel.kitchenwares = [...data]);
  }

  loadCategoryIngredients(): void {
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

  loadKitchenwareCategory(): void{
    this.kitchenwareService.getAllCategories().pipe(takeUntil(this.destroy)).subscribe({
      next: (data: string[]) => this.listCategoryKitchenware = data,
      error: () => this.listCategoryKitchenware = []
    })
  }

  removeIngredient(id: string): void {
    this.dishModel.ingredients = this.dishModel.ingredients.filter(u => u.id != id);
  }

  removeKitchenware(id: string): void {
    this.dishModel.kitchenwares = this.dishModel.kitchenwares.filter(u => u.id != id);
  }

  onSubmitForm(): void {
    this.alertService.clear();
    if(!this.dishModel.ingredients.length || !this.dishModel.kitchenwares.length){
      this.alertService.error("You forgot to choose the ingredients or kitchenware for the dish.", false, false, "formDish");
    }
    else if(this.form.valid){
      if(!this.modeEdit){
      this.dishService.createDish(this.dishModel).pipe(takeUntil(this.destroy)).subscribe({
        next: () => {
          this.alertService.success("Dish successfully added!", true, true);
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        },
        error: () => this.alertService.error("There was a server error. Please try again later.", false, false, "formDish")
      });
      }
    else {
      this.dishService.editDish(this.dishModel).pipe(takeUntil(this.destroy)).subscribe({
        next: () => {
          this.alertService.success("Dish successfully updated!", true, true);
          this.router.navigateByUrl("/dishes");
        },
        error: () => this.alertService.error("There was a server error. Please try again later.", false, false, "formDish")
      });
    }
  }
  }

  onAmountChange(event: Event, ingredient: Ingredient): void{
    if((<HTMLInputElement>event.target).value === ""){
      (<HTMLInputElement>event.target).value = "1";
    }
    ingredient.amount = Number((<HTMLInputElement>event.target).value);
  }

}
