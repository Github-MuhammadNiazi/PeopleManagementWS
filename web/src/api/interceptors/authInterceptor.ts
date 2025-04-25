import { apiClient } from "../config/apiConfig";

apiClient.interceptors.request.use((config) => {
    // TODO: Update token storage method to use a more secure storage solution
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['platform'] = 'web';
    return config;
  });
