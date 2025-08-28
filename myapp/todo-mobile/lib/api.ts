

import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';
  
  let apiClient: AxiosInstance | null = null;
  
  export function getApiBaseUrl(): string {
    if (Platform.OS === 'android') return 'http://192.168.1.35:8000'; // Android emulator
    if (Platform.OS === 'ios') return 'http://localhost:8000';    // iOS simulator
    return 'http://localhost:8000';                                // Web
  }
  
  export function getApiClient(): AxiosInstance {
    if (apiClient) return apiClient;
    apiClient = axios.create({
      baseURL: getApiBaseUrl(),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 15000,
    });
  
    apiClient.interceptors.request.use((config) => {
      console.log('[API] →', config.method?.toUpperCase(), config.url, config.data ?? null);
      return config;
    });
  
    apiClient.interceptors.response.use(
      (response) => {
        console.log('[API] ←', response.config.method?.toUpperCase(), response.config.url, response.status);
        return response;
      },
      (error) => {
        console.log('[API] ×', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  
    return apiClient;
  }
  
  export type Task = {
    id: string;
    title: string;
    completed?: boolean;
  };
  