import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Ingredient } from 'src/app/_models';
import { AlertService, IngredientService } from 'src/app/_services';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit, OnDestroy {
ingredient: Ingredient;
destroy: ReplaySubject<any> = new ReplaySubject<any>();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) data: Ingredient,
    private dialogRef: MatDialogRef<DeleteComponent>,
    private ingredientService: IngredientService,
    private alertService: AlertService
  ) { 
    this.ingredient = data;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  confirm(): void {
    this.ingredientService.changeIngredientStatus(this.ingredient.id!, !this.ingredient.active)
      .pipe(takeUntil(this.destroy)).subscribe({
        next: () => {
          this.alertService.success(`${this.ingredient.name} successfully ${this.ingredient.active ? "de" : ""}activated`, false, true);
          this.ingredient.active = !this.ingredient.active;
        },
        error: () => this.alertService.error(`An error occurred during ${this.ingredient.active ? "de" : ""}activation '${this.ingredient.name}'`, false, true),
      });
      this.dialogRef.close(this.ingredient);
  }

  close(): void {
    this.dialogRef.close();
  }
}
