import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Stock } from 'src/app/_models';
import { AlertService, StockService } from 'src/app/_services';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnDestroy {
  stockItem: Stock;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
    
    constructor(
      @Inject(MAT_DIALOG_DATA) data: Stock,
      private dialogRef: MatDialogRef<DeleteComponent>,
      private stockService: StockService,
      private alertService: AlertService
    ) { 
      this.stockItem = data;
    }
  
    ngOnDestroy(): void {
      this.destroy.next(null);
      this.destroy.complete();
    }
  
    confirm(): void {
      this.stockService.deleteIngredientInStock(this.stockItem.id)
        .pipe(takeUntil(this.destroy)).subscribe({
          next: () => {
            this.alertService.success(`'${this.stockItem.name}' successfully deleted`, false, true);
            this.dialogRef.close(this.stockItem);
          },
          error: () => this.alertService.error("There was a deletion error", false, true),
        });
        this.dialogRef.close();
    }
  
    close(): void {
      this.dialogRef.close();
    }

}
