import { Credentials } from './credentials';

export interface AccountSignUpDto {
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: string;
    credentials: Credentials;
  }