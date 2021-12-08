
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
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
    @Inject(MAT_DIALOG_DATA) public kitchenware: Kitchenware,
    public service: KitchenwareService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){1,35}$')]],
      category: ['', [Validators.required]],
    });
  }

  getCategories() {
    this.service.getAllCategories()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
            console.log(response + " got categories");
            this.categories = response;
          },
        error: () => {
          this.alertService.error("There was an error on the server, please try again later.");
        }}
      )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    if (this.form.valid) {
      this.service.addKitchenware(this.form)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success('Creation successful');
          },
          error: () => {
            this.alertService.error("There was an error on the server, please try again later.");
          }});
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.getCategories();
  }
}
