import { BaseResponse, MessageType, PhoneNumber } from './common';

export type NewsletterJid = `${string}@newsletter`;

export interface ChannelState {
    type: string;
}

export interface ChannelTextField {
    text: string;
}

export interface ChannelThreadMetadata {
    name?: ChannelTextField;
    description?: ChannelTextField;
    subscribers_count?: string;
}

export interface ChannelViewerMetadata {
    role?: string;
}

export interface ChannelData {
    id: NewsletterJid;
    state?: ChannelState;
    thread_metadata?: ChannelThreadMetadata;
    viewer_metadata?: ChannelViewerMetadata;
    name?: string;
    description?: string;
    invite?: string;
    subscribers?: number;
}

export interface SendChannelMessageRequest {
    type: MessageType;
    text?: string;
    url?: string;
    caption?: string;
    mimetype?: string;
    fileName?: string;
}

export interface SendChannelFileRequest extends SendChannelMessageRequest {
    file: Blob | File | Buffer | any;
}

export interface SendChannelMessageResponse extends BaseResponse {
    sent_at?: string;
}

export interface ChannelMetadataResponse extends BaseResponse {
    channel: ChannelData;
}

export interface ChannelInviteResponse extends BaseResponse {
    channel: ChannelData;
}

export interface CreateChannelRequest {
    name: string;
    description?: string;
}

export interface CreateChannelResponse extends BaseResponse {
    channel: {
        id: NewsletterJid;
        name: string;
        invite: string;
        subscribers: number;
    };
}

export interface UpdateChannelRequest {
    name?: string;
    description?: string;
    picture?: string;
}

export interface UpdateChannelResponse extends BaseResponse {
    message?: string;
}

export interface FollowChannelResponse extends BaseResponse {
    alreadyFollowing?: boolean;
}

export interface UnfollowChannelResponse extends BaseResponse {}
