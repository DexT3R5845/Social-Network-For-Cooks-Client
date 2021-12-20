export interface AlertMessage{
    type: TypeAlert;
    text: string;
    id: string;
    autoClose: boolean;
}

export enum TypeAlert{
    SUCCESS = "alert alert-success", 
    ERROR = "alert alert-danger"
}