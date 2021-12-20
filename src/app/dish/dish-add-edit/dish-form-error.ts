import { FormGroup } from "@angular/forms";

export class DishFormError{
form: FormGroup;

  get control() {
    return this.form.controls;
  }

    get descriptionErrorMessage(): string {
        return this.control['description'].hasError('required') ?
          'Enter description for dish, please' :
          this.control['description'].hasError('maxlength') ?
            'Max Length is 1000' : '';
      }

      get dishCategoryErrorMessage(): string {
          return this.control['dishCategory'].hasError('required') ?
          'Select dish category, please' :
          this.control['dishCategory'].hasError('maxlength') ?
            'Max Length is 30' : '';
      }

      get dishNameErrorMessage(): string {
        return this.control['dishName'].hasError('required') ?
          'Enter name for dish, please' :
          this.control['dishName'].hasError('maxlength') ?
            'Max Length is 30' : '';
      }

      get dishTypeErrorMessage(): string {
        return this.control['dishType'].hasError('required') ?
          'Enter type for dish, please' :
          this.control['dishType'].hasError('maxlength') ?
            'Max Length is 30' : '';
      }

      get imgUrlErrorMessage(): string {
        return this.control['imgUrl'].hasError('required') ?
          'Enter url on image for dish, please' :
          this.control['imgUrl'].hasError('maxlength') ?
            'Max Length is 300' : '';
      }

      get receiptErrorMessage(): string {
        return this.control['receipt'].hasError('required') ?
          'Enter receipt for dish, please' :
          this.control['receipt'].hasError('maxlength') ?
            'Max Length is 3000' : '';
      }

      get receipt(): string{
        return this.control['receipt'].value;
      }

      get imgUrl(): string{
        return this.control['imgUrl'].value;
      }

      get dishType(): string{
        return this.control['dishType'].value;
      }

      get dishName(): string{
        return this.control['dishName'].value;
      }

      get dishCategory(): string{
        return this.control['dishCategory'].value;
      }

      get description(): string{
        return this.control['description'].value;
      }

}