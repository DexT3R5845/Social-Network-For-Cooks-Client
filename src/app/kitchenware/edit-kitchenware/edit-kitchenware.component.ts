import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {Kitchenware} from "../../_models/kitchenware";
import {KitchenwareService} from "../../_services/kitchenware.service";

@Component({
  selector: 'app-edit-kitchenware',
  templateUrl: './edit-kitchenware.component.html',
  styleUrls: ['./edit-kitchenware.component.scss']
})
export class EditKitchenwareComponent implements OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  kitchenware: Kitchenware;
  alertMessage: string;
  categories: string[];

  constructor(
    public dialogRef: MatDialogRef<EditKitchenwareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: KitchenwareService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.kitchenware = data.kitchenware;
    this.categories = data.categories;
    this.form = this.formBuilder.group({
      id: [this.data.id],
      imgUrl: [null, [Validators.required, Validators.pattern('[^\s]+(.*?)\.(jpg|jpeg|png|JPG|JPEG|PNG)$')]],
      name: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){1,35}$')]],
      category: ['', [Validators.required]]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  public editKitchenware(): void {
    if (this.form.valid) {
      const kitchenware : Kitchenware = this.form.value;
      this.service.editKitchenware(kitchenware)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Kitchenware successfully updated.", true, true);
            this.dialogRef.close(kitchenware);
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error(error.error.message, false, false, "error-dialog");
                break;
              default:
                this.alertService.error("unexpected error, try later", false, false, "error-dialog");
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
