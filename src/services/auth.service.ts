import apiService, { ApiService } from './api';
import { ApiResponse } from '@/types/api.types';
import { ICreateUser, IUser } from '@/types/user.types';
import { jwtDecode } from 'jwt-decode';
import { config } from '@/config/configURL';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: IUser;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

/**
 * Provides authentication-related API services
 * Single source of truth for authentication in the application
 */
class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  private endpoints = config.api.endpoint.auth;

  /**
   * Log in an existing user
   * @param credentials - User login credentials
   * @returns Login response with token and user data
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(this.endpoints.login, credentials);
    
    if (response.success && response.data) {
      this.setToken(response.data.access_token);
      this.setUser(response.data.user);
    }

    return response;
  }

  /**
   * Register a new user
   * @param userData - New user data
   * @returns Newly created user data
   */
  async register(userData: ICreateUser): Promise<ApiResponse<RegisterResponse>> {
    return await apiService.post<RegisterResponse>(this.endpoints.register, userData);
  }

  /**
   * Get the current user's profile data
   * @returns User profile data
   */
  async getProfile(): Promise<ApiResponse<IUser>> {
    return await apiService.get<IUser>(this.endpoints.profile);
  }
  
  /**
   * Log out the current user - both client-side and server-side
   * @returns Logout response from server
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if it exists
      if (this.isAuthenticated()) {
        await apiService.post(this.endpoints.logout);
      }
    } catch (error) {
      console.error('Error logging out on server:', error);
    } finally {
      // Always clear local storage regardless of server response
      this.clearAuth();
    }
  }

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if the user is logged in
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get the stored JWT token
   * @returns The JWT token or null if not found
   */
  getToken(): string | null {
    return ApiService.getAuthToken();
  }

  /**
   * Set the JWT token in local storage
   * @param token - JWT token to store
   */
  setToken(token: string): void {
    ApiService.setAuthToken(token);
  }

  /**
   * Get the stored user data
   * @returns User data or null if not found
   */
  getUser(): IUser | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Set the user data in local storage
   * @param user - User data to store
   */
  setUser(user: IUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  /**
   * Clear all authentication data from client
   */
  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }
  
  /**
   * Check if the token is expired
   * @param token - JWT token to check
   * @returns true if token is expired, false otherwise
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Consider invalid tokens as expired
    }
  }

  /**
   * Extract user data from JWT token
   * @param token - JWT token to extract from
   * @returns parsed user data from token
   */
  extractUserFromToken(token: string): Partial<IUser> | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      return {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role as any,
      };
    } catch (error) {
      console.error('Error extracting user from token:', error);
      return null;
    }
  }
  
  /**
   * Get authentication redirect URL based on auth status and page requirements
   * @param isAuthenticated - Whether user is authenticated
   * @param authRequiredPage - Whether current page requires authentication
   * @param authRedirectUrl - URL to redirect authenticated users
   * @param guestRedirectUrl - URL to redirect unauthenticated users
   * @returns The URL to redirect to, or null if no redirect needed
   */
  getAuthRedirectUrl(
    isAuthenticated: boolean,
    authRequiredPage: boolean,
    authRedirectUrl: string = '/dashboard',
    guestRedirectUrl: string = '/'
  ): string | null {
    // If page requires auth and user is not authenticated
    if (authRequiredPage && !isAuthenticated) {
      return guestRedirectUrl;
    }

    // If page is for unauthenticated users (like login) and user is authenticated
    if (!authRequiredPage && isAuthenticated) {
      return authRedirectUrl;
    }

    // No redirect needed
    return null;
  }
}

export const authService = new AuthService();
export default authService;
