import { Role } from "./role";

export class Account{
    email: string;
    role: Role;
    token: string;

    constructor(_email:string, _role: Role, _token:string){
        this.email = _email;
        this.role = _role;
        this. token = _token;
    }
}