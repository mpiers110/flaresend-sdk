export type MessageType = 'text' | 'image' | 'video' | 'document' | 'audio' | 'template';

export interface BaseResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export type GroupJid = `${string}@g.us`;
export type UserJid = `${string}@s.whatsapp.net` | `${string}@lid`;
export type PhoneNumber = string;

export interface PaginationParams {
    page?: number;
    limit?: number;
}
