import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
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
export class EditKitchenwareComponent implements OnInit, OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  kitchenware: Kitchenware;
  alertMessage: string;
  categories: string[];

  constructor(
    public dialogRef: MatDialogRef<EditKitchenwareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Kitchenware,
    public service: KitchenwareService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.form = this.formBuilder.group({
      id: [this.data.id],
      image: [this.data.imgUrl],
      name: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){1,35}$')]],
      category: ['', [Validators.required]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public editKitchenware(): void {
    if (this.form.valid) {
      this.service.editKitchenware(this.form, this.data.id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success('Edit successful');
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertMessage = error.error.message;
                break;
              default:
                this.alertMessage = "There was an error on the server, please try again later."
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

  ngOnInit(): void {
    this.getCategories();
    this.service.getById(this.data.id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (data : Kitchenware) => {
          this.kitchenware = data;
        },
        error: error => {
          switch(error.status){
            case 404:
              this.alertMessage = error.error.message;
              break;
            default:
              this.alertMessage = "There was an error on the server, please try again later."
              break;
          }
          this.alertService.error(this.alertMessage);
        }});
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
}

