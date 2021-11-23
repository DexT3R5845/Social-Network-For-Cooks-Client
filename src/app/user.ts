import { Gender } from "./gender";

export class User{
    private name:string;
    private surname:string;
    private birthDate: string;
    private gender:Gender;
    private email:string;
    private password:string;
    private confirmPassword:string;

    constructor(name:string, surname:string, birthDate:string,
        gender:string, email:string, password:string, confirmPassword:string){
       this.name = name;
       this.surname = surname;
       this.birthDate = birthDate;
       this.gender = new Gender(gender);
       this.email = email;
       this.password = password;
       this.confirmPassword = confirmPassword;  
   }

   getName():string {
        return this.name;
   }

   getSurname():string {
        return this.surname;
   }

   getBirthDate():string {
        return this.birthDate;
   }

   getGender():Gender {
        return this.gender;
   }

   getEmail():string {
        return this.email;
   }
   getPassword():string {
        return this.password;
   }
   
   getConfirmPassword():string {
        return this.confirmPassword;
   }

}