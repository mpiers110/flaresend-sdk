import { HttpClient } from '../utils/http';
import {
    SendMessageRequest,
    SendMessageResponse,
    ScheduleMessageRequest,
    ScheduleResponse
} from '../types/messages';

export class MessagesResource {
    constructor(private client: HttpClient) { }

    /**
     * Send a message immediately
     */
    async send(params: SendMessageRequest): Promise<SendMessageResponse> {
        return this.client.post<SendMessageResponse>('/send-message', params);
    }

    /**
     * Send a file using FormData (for local files)
     */
    async sendFile(params: SendMessageRequest & { file: Blob | File }): Promise<SendMessageResponse> {
        const formData = new FormData();

        params.recipients.forEach((recipient, index) => {
            formData.append(`recipients[${index}]`, recipient);
        });

        formData.append('type', params.type);

        if (params.file) {
            formData.append('file', params.file);
        }

        if (params.caption) {
            formData.append('caption', params.caption);
        }

        if (params.fileName) {
            formData.append('fileName', params.fileName);
        }

        if (params.text) {
            formData.append('text', params.text);
        }

        return this.client.post<SendMessageResponse>('/send-message', formData);
    }

    /**
     * Schedule a message for future delivery
     */
    async schedule(params: ScheduleMessageRequest): Promise<ScheduleResponse> {
        return this.client.post<ScheduleResponse>('/schedule-message', params);
    }
}
