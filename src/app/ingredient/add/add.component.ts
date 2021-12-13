import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Ingredient } from 'src/app/_models';
import { ingredientCategory } from 'src/app/_models/ingredient.category';
import { AlertService, IngredientService } from 'src/app/_services';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, OnDestroy {
listCategories: ingredientCategory[] = [];
form: FormGroup;
destroy: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: ingredientCategory[],
    private formBuilder: FormBuilder,
    private diaglogRef: MatDialogRef<AddComponent>,
    private ingredientService: IngredientService,
    private alertService: AlertService
  ) {
    this.listCategories = data;
    this.form = formBuilder.group({
      name: ['', Validators.required],
      imgUrl: ['', Validators.maxLength(300)],
      ingredientCategory: ['', Validators.required],
      status: ['', Validators.required]
    })
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  add(){
    this.alertService.clear();
    if(this.form.valid){
    const ingredient: Ingredient = {
      id: "0",
      name: this.name,
      imgUrl: this.imgUrl,
      ingredientCategory: this.ingredientCategory,
      active: this.status
    }
    delete ingredient.id;
    this.ingredientService.addIngredient(ingredient)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Ingredient successfully added.", true, true);
            this.diaglogRef.close();
          },
          error: error =>{
            let errorMessage = "";
            switch(error.status){
              case 400:
              Object.keys(error.error.data).forEach(key => {
                errorMessage += error.error.data[key];
              });
              break;
              default:
                errorMessage = "There was a server error."
                break;
            }
            this.alertService.error(errorMessage, false, false, "error-dialog");
          }
        })
      }
  }

  close(){
    this.diaglogRef.close();
  }

  get control(){
    return this.form.controls;
  }

  get name(){
    return this.control['name'].value;
  }

  get imgUrl(){
    return this.control['imgUrl'].value;
  }

  get ingredientCategory(){
    return this.control['ingredientCategory'].value;
  }

  get status(){
    return this.control['status'].value;
  }
}
