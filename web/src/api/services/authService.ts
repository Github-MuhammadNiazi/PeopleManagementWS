import { apiClient } from '../config/apiConfig';
import * as endpoints from '../config/endpoints';
import { LoginRequest, LoginResponse } from '../types/apiTypes';

const authenticateConnection = async (): Promise<void> => {
    try {
        const response = await apiClient.get(endpoints.auth.authenticateConnection);
        return response.data;
    } catch (error) {
        console.error('Error in authenticateConnection:', error);
        throw error;
    }
};

const login = async (requestBody: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>(endpoints.auth.login, requestBody);
        // TODO: Store the token in local storage or context
        return response.data;
    } catch (error) {
        console.error('Error in login:', error);
        throw error;
    }
};

export {
    authenticateConnection,
    login,
};
