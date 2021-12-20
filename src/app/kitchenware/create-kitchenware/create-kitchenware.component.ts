import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {Kitchenware} from "../../_models/kitchenware";
import {KitchenwareService} from "../../_services/kitchenware.service";

@Component({
  selector: 'app-create-kitchenware',
  templateUrl: './create-kitchenware.component.html',
  styleUrls: ['./create-kitchenware.component.scss']
})
export class CreateKitchenwareComponent implements OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  alertMessage: string;
  categories: string[];

  constructor(
    public dialogRef: MatDialogRef<CreateKitchenwareComponent>,
    @Inject(MAT_DIALOG_DATA) data: string[],
    public service: KitchenwareService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.categories = data;
    this.form = this.formBuilder.group({
      imgUrl: [null, [Validators.required, Validators.pattern('[^\s]+(.*?)\.(jpg|jpeg|png|JPG|JPEG|PNG)$')]],
      name: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){1,35}$')]],
      category: ['', [Validators.required]],
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    if (this.form.valid) {
      const kitchenware : Kitchenware = this.form.value;
      this.service.addKitchenware(kitchenware)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Kitchenware successfully created.", true, true);
            this.dialogRef.close();
          },
          error: error => {
            this.alertService.error(error.error.message, false, false, "error-dialog");
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
