export class Gender{
    gender:string;

    private stringToGender(strGender:string): string {
        if(strGender==="Male"){
            return "M";
        }
        return "F";
    }

    constructor(gender:string){
        this.gender = this.stringToGender(gender);
    }
}