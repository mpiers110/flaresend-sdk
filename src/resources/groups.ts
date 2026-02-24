import { HttpClient } from '../utils/http';
import { PaginationParams } from '../types/common';
import {
    CreateGroupRequest,
    CreateGroupResponse,
    ListGroupsResponse,
    GetGroupResponse,
    GroupInviteLinkResponse,
    SendGroupMessageRequest,
    SendGroupMessageResponse,
    ManageParticipantsRequest
} from '../types/groups';
import { BaseResponse } from '../types/common';

export class GroupsResource {
    constructor(private client: HttpClient) { }

    /**
     * Create a new group
     */
    async create(params: CreateGroupRequest): Promise<CreateGroupResponse> {
        return this.client.post<CreateGroupResponse>('/groups', params);
    }

    /**
     * List all groups
     */
    async list(params?: PaginationParams): Promise<ListGroupsResponse> {
        return this.client.get<ListGroupsResponse>('/groups', params as any);
    }

    /**
     * Get information about a specific group
     */
    async get(groupId: string): Promise<GetGroupResponse> {
        return this.client.get<GetGroupResponse>(`/groups/${groupId}`);
    }

    /**
     * Get group invite link
     */
    async getInviteLink(groupId: string): Promise<GroupInviteLinkResponse> {
        return this.client.get<GroupInviteLinkResponse>(`/groups/${groupId}/invite-link`);
    }

    /**
     * Send a message to one or more groups
     */
    async sendMessage(params: SendGroupMessageRequest): Promise<SendGroupMessageResponse> {
        return this.client.post<SendGroupMessageResponse>('/groups/send-message', params);
    }

    /**
     * Manage group participants (add, remove, promote, demote)
     */
    async manageParticipants(groupId: string, params: ManageParticipantsRequest): Promise<BaseResponse> {
        return this.client.post<BaseResponse>(`/groups/${groupId}/participants`, params);
    }
}
