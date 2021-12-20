import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReplaySubject, takeUntil} from 'rxjs';
import {Ingredient} from 'src/app/_models';
import {AlertService, IngredientService} from 'src/app/_services';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  ingredient: Ingredient;
  listCategories: string[] = [];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  modeEdit: boolean = true;
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddEditComponent>,
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
    this.modeEdit = this.ingredient.id !== undefined;
    this.title = this.modeEdit ? "Edit Ingredient" : "Create New Ingredient";
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.alertService.clear();
    if(this.form.valid){
      if(this.modeEdit){
    this.ingredientService.editIngredient(this.ingredient)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Ingredient successfully updated.", true, true);
            this.dialogRef.close(this.ingredient);
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
      else {
        this.ingredientService.addIngredient(this.ingredient)
          .pipe(takeUntil(this.destroy))
          .subscribe({
            next: () => {
              this.alertService.success("Ingredient successfully added.", true, true);
              this.dialogRef.close();
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
          });
      }
    }
  }

}
