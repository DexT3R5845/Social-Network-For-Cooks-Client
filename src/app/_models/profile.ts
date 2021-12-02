export class Profile{
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    imgUrl: string

    constructor(
        private _firstName: string,
        private _lastName: string,
        private _birthDate: string,
        private _gender: string,
        private _imgUrl: string
    ){
        this.firstName = _firstName;
        this.lastName = _lastName,
        this.birthDate = _birthDate;
        this.gender = _gender;
        this.imgUrl = _imgUrl;
    }
}