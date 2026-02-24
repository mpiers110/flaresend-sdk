import { BaseResponse, MessageType, PhoneNumber } from './common';

export interface SendMessageRequest {
    recipients: PhoneNumber[];
    type: MessageType;
    text?: string;
    url?: string;
    caption?: string;
    fileName?: string;
}

export interface SendFileRequest extends Omit<SendMessageRequest, 'url'> {
    file: Blob | Buffer | any; // Any for node environments where Buffer might be used
}

export interface SendMessageResponse extends BaseResponse {
    sent_at: string;
    total_recipients: number;
    successful_recipients: string[];
    failed_recipients: string[];
    invalid_recipients: string[];
}

export interface ScheduleMessageRequest extends SendMessageRequest {
    sendAt: string; // YYYY-MM-DD HH:mm:ss
}

export interface ScheduleResponse extends BaseResponse {
    scheduled_for: string;
    task_id: string;
}

export interface ScheduledMessage {
    id: string;
    recipients: string[];
    type: MessageType;
    text?: string;
    url?: string;
    caption?: string;
    sendAt: string;
    status: 'pending' | 'sent' | 'cancelled';
}

export interface ListScheduledMessagesResponse extends BaseResponse {
    data: ScheduledMessage[];
}

export interface UpdateScheduledMessageRequest {
    recipients?: string[];
    type?: MessageType;
    text?: string;
    url?: string;
    caption?: string;
    sendAt?: string;
}
