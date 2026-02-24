import { HttpClient } from '../utils/http';
import {
    ListScheduledMessagesResponse,
    UpdateScheduledMessageRequest
} from '../types/messages';
import { BaseResponse } from '@/types/common';

export class ScheduledResource {
    constructor(private client: HttpClient) { }

    /**
     * List all scheduled messages
     */
    async list(): Promise<ListScheduledMessagesResponse> {
        return this.client.get<ListScheduledMessagesResponse>('/scheduled-messages');
    }

    /**
     * Update a scheduled message
     */
    async update(id: string, params: UpdateScheduledMessageRequest): Promise<BaseResponse & { id: string; updated_fields: string[] }> {
        return this.client.patch<BaseResponse & { id: string; updated_fields: string[] }>(`/scheduled-messages/${id}`, params);
    }

    /**
     * Cancel a scheduled message
     */
    async cancel(id: string): Promise<BaseResponse & { id: string }> {
        return this.client.delete<BaseResponse & { id: string }>(`/scheduled-messages/${id}`);
    }
}
