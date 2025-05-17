import { config } from '../config/configURL';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiErrorResponse, ApiResponse } from "../types/api.types";

class ApiService {
    private api: AxiosInstance
    private static instance: ApiService

    private constructor() {
        this.api = axios.create({
            baseURL: config.api.baseURL,
            timeout: config.api.timeout,
            headers: {
                'Content-Type': 'application/json',
            }
        })

        this.api.interceptors.request.use(
            (config) => {
                const token = ApiService.getAuthToken()
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`
                }
                return config
            }
        )

        this.api.interceptors.response.use(
            (response) => response,
            this.handleApiError
        )
    }
    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService()
        }
        return ApiService.instance
    }

    public static getAuthToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token')
        }
        return null
    }

    private async handleApiError(error: AxiosError): Promise<never> {
        const errorResponse: ApiErrorResponse = {
            status: error.response?.status || 500,
            message: 'An error occurred during the request',
            error: []
        }

        if (error.response?.data) {
            errorResponse.message = error.response.data.message || errorResponse.message;
            errorResponse.error = error.response.data.error || [];
        }

        if (error.response?.status === 401) {

        }

        return Promise.reject(errorResponse)
    }

    public async request<T>(option: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse = await this.api(option)
            return {
                data: response.data,
                status: response.status,
                success: true
            }
        } catch (error) {
            throw error
        }
    }

    public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'GET', url, params });
    }

    public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'POST', url, data });
    }

    public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'PUT', url, data });
    }

    public async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'PATCH', url, data });
    }

    public async delete<T>(url: string): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'DELETE', url });
    }
}

export const apiService = ApiService.getInstance();
export default apiService;