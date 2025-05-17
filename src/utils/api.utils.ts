/**
 * API utility functions to support services
 */

import { ApiErrorResponse } from "@/types/api.types";

/**
 * Creates a query string from an object of parameters
 * @param params - Object containing query parameters
 * @returns Formatted query string
 */

export const createQueryString = (params: Record<string, any>): string => {
    const validParams = Object.entries(params).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ''
    )
    if (validParams.length === 0) return '';
    const queryParams = validParams.map(([key, value]) => {
    // Handle arrays specially
    if (Array.isArray(value)) {
        return value.map(item => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`).join('&');
    }
    // Handle objects - convert to JSON string
    if (typeof value === 'object') {
        return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
    }
    // Simple key-value pair
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join('&');

    return `?${queryParams}`;
};

/**
 * Formats API errors into user-friendly messages
 * @param error - Error response from API
 * @returns User-friendly error message
 */
export const formatErrorMessage = (error: ApiErrorResponse): string => {
    // If there are specific errors, join them
    if (error.error && error.error.length > 0) {
        return error.error.map((err: string | { field?: string, message: string }) => {
            if (typeof err === 'string') {
                return err;
            }
            return err.message;
        }).join('. ');
    }

    // Map common status codes to friendly messages
    switch (error.status) {
        case 400:
            return 'The request was invalid. Please check your input.';
        case 401:
            return 'You need to log in to access this feature.';
        case 403:
            return 'You don\'t have permission to access this resource.';
        case 404:
            return 'The requested resource was not found.';
        case 422:
            return 'The provided data was invalid.';
        case 429:
            return 'Too many requests. Please try again later.';
        case 500:
        case 502:
        case 503:
            return 'A server error occurred. Please try again later.';
        default:
            return error.message || 'An unexpected error occurred.';
    }
};

/**
 * Parse link header for pagination
 * @param linkHeader - Link header from API response
 * @returns Object with pagination links
 */
export const parsePaginationLinks = (linkHeader?: string) => {
    if (!linkHeader) return {};

    const links: Record<string, string> = {};

    // Example Link header:
    // <https://api.com/items?page=3>; rel="next", <https://api.com/items?page=1>; rel="prev"
    const parts = linkHeader.split(',');

    parts.forEach(part => {
        const match = part.match(/<(.+?)>; rel="(.+?)"/);
        if (match) {
            const [_, url, name] = match;
            links[name] = url;
        }
    });

    return links;
};

/**
 * Creates a debounced function for API calls
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */

export const debounceApiCall = <T extends (...args: any[]) => any>(
    fn: T,
    delay = 300
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

/**
 * Extracts file name from content-disposition header
 * @param contentDisposition - Content-Disposition header value
 * @returns File name if available
 */

export const getFileNameFromHeader = (contentDisposition?: string): string | null => {
    if (!contentDisposition) return null;

    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/['"]/g, '');
    }

    return null;
};

/**
 * Helper to extract data from multiple endpoints in parallel
 * @param requests - Array of promise-returning functions
 * @returns Results from all requests
 */

export const fetchParallel = async <T>(
    requests: Array<() => Promise<T>>
): Promise<Array<T>> => {
    try {
        return await Promise.all(requests.map(request => request()));
    } catch (error) {
        console.error('Error in parallel fetching:', error);
        throw error;
    }
};