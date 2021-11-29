import {Gender} from "../gender";
import {ElementRef} from "@angular/core";

export class UserUpdate {
  private _firstName: string;
  private _lastName: string;
  private _birthDate: string;
  private _gender: Gender;
  private _imgUrl: ElementRef;

  constructor(firstName: string, lastName: string, birthDate: string, gender: string, imgUrl: ElementRef) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._birthDate = birthDate;
    this._gender = new Gender(gender);
    this._imgUrl = imgUrl;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get birthDate(): string {
    return this._birthDate;
  }

  get gender(): Gender {
    return this._gender;
  }

  get getStringGender(): string{
    if(this._gender.gender === "M"){
      return "Male";
    }
    return "Female";


  }

  get imgUrl(): ElementRef {
    return this._imgUrl;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  set birthDate(value: string) {
    this._birthDate = value;
  }

  set imgUrl(value: ElementRef) {
    this._imgUrl = value;
  }
}
