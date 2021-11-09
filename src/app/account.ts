import { Role } from './role';
import { Credentials } from './credentials';

export interface Account {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: string;
    image: string;
    role: Role;
    credentials: Credentials;
  }