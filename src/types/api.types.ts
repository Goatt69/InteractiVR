
export interface ApiResponse<T> {
    data: T
    status: number
    success: boolean
}

export interface ApiErrorResponse {
    status: number
    message: string
    error: Array<string | { field?: string, message: string}>
}
