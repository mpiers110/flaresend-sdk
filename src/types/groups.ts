import { BaseResponse, GroupJid, PhoneNumber, UserJid } from './common';

export interface CreateGroupRequest {
    subject: string;
    participants: PhoneNumber[];
}

export interface GroupParticipant {
    id: UserJid;
    admin: 'superadmin' | 'admin' | null;
}

export interface GroupData {
    id: GroupJid;
    subject: string;
    size: number;
    owner: UserJid;
    participants: GroupParticipant[];
    creation?: number;
    desc?: string;
}

export interface CreateGroupResponse extends BaseResponse {
    data: GroupData;
}

export interface ListGroupsResponse extends BaseResponse {
    data: Record<GroupJid, GroupData>;
}

export interface GetGroupResponse extends BaseResponse {
    data: GroupData & {
        name?: string; // API seems to use 'name' or 'subject' inconsistently in docs
        createdAt?: string;
    };
}

export interface GroupInviteLinkResponse extends BaseResponse {
    data: string;
}

export interface SendGroupMessageRequest {
    groupJids: GroupJid[];
    type: string;
    text?: string;
    url?: string;
    caption?: string;
}

export interface SendGroupMessageResponse extends BaseResponse {
    data: {
        delivered: GroupJid[];
        failed: GroupJid[];
    };
}

export type ParticipantAction = 'add' | 'remove' | 'promote' | 'demote';

export interface ManageParticipantsRequest {
    participants: PhoneNumber[];
    action: ParticipantAction;
}
