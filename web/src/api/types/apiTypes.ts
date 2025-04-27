export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        isEmployee: boolean;
        token: string;
    };
    error: string | null;
}
