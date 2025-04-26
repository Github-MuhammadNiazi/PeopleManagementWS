import { apiClient } from '../config/apiConfig';

const authenticateConnection = async () => {
    try {
        const response = await apiClient.get('/auth');
        return response.data;
    } catch (error) {
        console.error('Error in authenticateConnection:', error);
        throw error;
    }
};

export { authenticateConnection };
