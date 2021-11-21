export interface AuthResponse {
    token: string;
    status: number;
    enableCaptcha: boolean;
    invalidCreds: boolean;
    invalidEmailFormat: boolean;
    invalidPassFormat: boolean;
    banned: boolean;
}
