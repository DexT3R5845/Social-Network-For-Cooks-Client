import { Role } from "./role";

export interface Account{
    email: string;
    role: Role;
    token: string;
}