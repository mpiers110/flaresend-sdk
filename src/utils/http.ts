import {
    FlaresendError,
    AuthenticationError,
    NotFoundError,
    ValidationError,
    InstanceNotReadyError,
    ForbiddenError,
} from './errors';

export interface HttpClientOptions {
    apiKey: string;
    baseUrl?: string;
}

export class HttpClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(options: HttpClientOptions) {
        this.apiKey = options.apiKey;
        this.baseUrl = options.baseUrl || 'https://api.flaresend.com';
    }

    private async request<T>(
        path: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            ...options.headers,
        };

        // Auto-set Content-Type for JSON requests if not using FormData
        if (!(options.body instanceof FormData) && !headers['Content-Type' as keyof typeof headers]) {
            (headers as any)['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                this.handleErrorResponse(response.status, data);
            }

            return data as T;
        } catch (error) {
            if (error instanceof FlaresendError) {
                throw error;
            }
            throw new FlaresendError((error as Error).message || 'An unexpected error occurred');
        }
    }

    private handleErrorResponse(status: number, data: any): never {
        const message = data.message || data.error || 'Request failed';

        switch (status) {
            case 401:
                throw new AuthenticationError(message, status, data);
            case 400:
                throw new ValidationError(message, status, data);
            case 403:
                throw new ForbiddenError(message, status, data);
            case 404:
                throw new NotFoundError(message, status, data);
            case 425:
                throw new InstanceNotReadyError(message, status, data);
            default:
                throw new FlaresendError(message, status, data);
        }
    }

    async get<T>(path: string, params?: Record<string, string>): Promise<T> {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return this.request<T>(`${path}${query}`, { method: 'GET' });
    }

    async post<T>(path: string, body?: any): Promise<T> {
        const options: RequestInit = {
            method: 'POST',
            body: body instanceof FormData ? body : JSON.stringify(body),
        };
        return this.request<T>(path, options);
    }

    async patch<T>(path: string, body?: any): Promise<T> {
        const options: RequestInit = {
            method: 'PATCH',
            body: body instanceof FormData ? body : JSON.stringify(body),
        };
        return this.request<T>(path, options);
    }

    async put<T>(path: string, body?: any): Promise<T> {
        const options: RequestInit = {
            method: 'PUT',
            body: body instanceof FormData ? body : JSON.stringify(body),
        };
        return this.request<T>(path, options);
    }

    async delete<T>(path: string): Promise<T> {
        return this.request<T>(path, { method: 'DELETE' });
    }
}
