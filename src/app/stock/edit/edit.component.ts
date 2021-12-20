import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Stock } from 'src/app/_models';
import { AlertService, StockService } from 'src/app/_services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnDestroy {
  form: FormGroup;
  stockItem: Stock;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: Stock,
    private formBuilder: FormBuilder,
    private diaglogRef: MatDialogRef<EditComponent>,
    private alertService: AlertService,
    private stockService: StockService
  ) {
    this.stockItem = data;
    this.form = formBuilder.group({
      name: [{value: '', disabled: true}, Validators.required],
      amount: ['', [Validators.required, Validators.min(0), Validators.max(10000)]]
    })
   }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  close(): void {
    this.diaglogRef.close();
  }

  save(): void {
    this.alertService.clear();
    if(this.form.valid){  
    this.stockService.editIngredientInStock(this.stockItem.id, this.amount)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Stock item successfully updated.", true, true);
            this.stockItem.amount = this.amount;
            this.diaglogRef.close(this.stockItem);
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

  get amount(): number{
    return this.control['amount'].value;
  }

  get amountErrorMessage(): string {
    return this.control['amount'].hasError('required') ?
      'Enter amount, please' :
      this.control['amount'].hasError('min') ?
      'Min value is 1' : 
      this.control['amount'].hasError('max') ?
      'Max value is 10 000' : '';
  }
  
}
