import { HttpClient } from '../utils/http';
import {
    SendChannelMessageRequest,
    SendChannelFileRequest,
    SendChannelMessageResponse,
    ChannelMetadataResponse,
    ChannelInviteResponse,
    CreateChannelRequest,
    CreateChannelResponse,
    UpdateChannelRequest,
    UpdateChannelResponse,
    FollowChannelResponse,
    UnfollowChannelResponse,
    NewsletterJid
} from '../types/channels';

function buildFormData(params: SendChannelFileRequest): FormData {
    const formData = new FormData();

    formData.append('type', params.type);

    if (params.text) {
        formData.append('text', params.text);
    }

    if (params.url) {
        formData.append('url', params.url);
    }

    if (params.caption) {
        formData.append('caption', params.caption);
    }

    if (params.mimetype) {
        formData.append('mimetype', params.mimetype);
    }

    if (params.fileName) {
        formData.append('fileName', params.fileName);
    }

    if (params.file) {
        formData.append('file', params.file as any);
    }

    return formData;
}

export class ChannelsResource {
    constructor(private client: HttpClient) { }

    async send(newsletterJid: NewsletterJid, params: SendChannelMessageRequest): Promise<SendChannelMessageResponse> {
        return this.client.post<SendChannelMessageResponse>(`/channels/${newsletterJid}/message`, params);
    }

    async sendFile(newsletterJid: NewsletterJid, params: SendChannelFileRequest): Promise<SendChannelMessageResponse> {
        const formData = buildFormData(params);
        return this.client.post<SendChannelMessageResponse>(`/channels/${newsletterJid}/message`, formData);
    }

    async getById(newsletterJid: NewsletterJid): Promise<ChannelMetadataResponse> {
        return this.client.get<ChannelMetadataResponse>(`/channels/${newsletterJid}`);
    }

    async getByInviteCode(inviteCode: string): Promise<ChannelInviteResponse> {
        return this.client.get<ChannelInviteResponse>(`/channels/invite/${inviteCode}`);
    }

    async create(params: CreateChannelRequest): Promise<CreateChannelResponse> {
        return this.client.post<CreateChannelResponse>('/channels', params);
    }

    async update(newsletterJid: NewsletterJid, params: UpdateChannelRequest): Promise<UpdateChannelResponse> {
        return this.client.put<UpdateChannelResponse>(`/channels/${newsletterJid}`, params);
    }

    async follow(newsletterJid: NewsletterJid): Promise<FollowChannelResponse> {
        return this.client.post<FollowChannelResponse>(`/channels/${newsletterJid}/follow`);
    }

    async unfollow(newsletterJid: NewsletterJid): Promise<UnfollowChannelResponse> {
        return this.client.post<UnfollowChannelResponse>(`/channels/${newsletterJid}/unfollow`);
    }
}
