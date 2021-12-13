import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReplaySubject, takeUntil} from 'rxjs';
import {Ingredient} from 'src/app/_models';
import {ingredientCategory} from 'src/app/_models/ingredient.category';
import {AlertService, IngredientService} from 'src/app/_services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  ingredient: Ingredient;
  listCategories: ingredientCategory[] = [];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditComponent>,
    private ingredientService: IngredientService,
    private alertService: AlertService
  ) {
    this.ingredient = data.ingredient;
    this.listCategories = data.listCategories;
    this.form = formBuilder.group({
      id: [{value: '', disabled: true}, Validators.required],
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

  close(){
    this.dialogRef.close();
  }

  save(){
    this.alertService.clear();
    if(this.form.valid){
    const ingredient: Ingredient = {
      id: this.id,
      name: this.name,
      imgUrl: this.imgUrl,
      ingredientCategory: this.ingredientCategory,
      active: this.status
    }
    this.ingredientService.editIngredient(ingredient)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Ingredient successfully updated.", true, true);
            this.dialogRef.close(ingredient);
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

  get control(){
    return this.form.controls;
  }

  get id(){
    return this.control['id'].value;
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
