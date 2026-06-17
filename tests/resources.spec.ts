import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ChannelsResource } from '../src/resources/channels';
import { GroupsResource } from '../src/resources/groups';
import { MessagesResource } from '../src/resources/messages';
import { ScheduledResource } from '../src/resources/scheduled';
import { WebhooksResource } from '../src/resources/webhooks';

function createMockClient() {
  return {
    get: vi.fn().mockResolvedValue({}),
    post: vi.fn().mockResolvedValue({}),
    put: vi.fn().mockResolvedValue({}),
    patch: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  };
}

describe('Resource wrappers', () => {
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('MessagesResource.send forwards data to the client', async () => {
    const messages = new MessagesResource(mockClient as any);
    await messages.send({ recipients: ['1234'], type: 'text', text: 'hello' });

    expect(mockClient.post).toHaveBeenCalledWith('/send-message', {
      recipients: ['1234'],
      type: 'text',
      text: 'hello',
    });
  });

  it('MessagesResource.sendFile sends FormData', async () => {
    const messages = new MessagesResource(mockClient as any);
    const file = new Blob(['hello'], { type: 'text/plain' });

    await messages.sendFile({ recipients: ['1234'], type: 'file', file, caption: 'caption', text: 'a text', fileName: 'hello.txt' });

    expect(mockClient.post).toHaveBeenCalledWith('/send-message', expect.any(FormData));
  });

  it('MessagesResource.schedule forwards schedule request', async () => {
    const messages = new MessagesResource(mockClient as any);
    await messages.schedule({ recipients: ['1234'], type: 'text', text: 'later', sendAt: '2026-12-31 12:00:00' });

    expect(mockClient.post).toHaveBeenCalledWith('/schedule-message', {
      recipients: ['1234'],
      type: 'text',
      text: 'later',
      sendAt: '2026-12-31 12:00:00',
    });
  });

  it('GroupsResource list passes pagination params', async () => {
    const groups = new GroupsResource(mockClient as any);
    await groups.list({ limit: '10', offset: '0' } as any);

    expect(mockClient.get).toHaveBeenCalledWith('/groups', { limit: '10', offset: '0' });
  });

  it('GroupsResource methods call their client endpoints', async () => {
    const groups = new GroupsResource(mockClient as any);
    await groups.create({ subject: 'Team', participants: ['1234'] });
    await groups.get('group-id');
    await groups.getInviteLink('group-id');
    await groups.sendMessage({ groupJids: ['group-id'], type: 'text', text: 'hello' });
    await groups.manageParticipants('group-id', { participants: ['1234'], action: 'add' });

    expect(mockClient.post).toHaveBeenCalledWith('/groups', { subject: 'Team', participants: ['1234'] });
    expect(mockClient.get).toHaveBeenCalledWith('/groups/group-id');
    expect(mockClient.get).toHaveBeenCalledWith('/groups/group-id/invite-link');
    expect(mockClient.post).toHaveBeenCalledWith('/groups/send-message', { groupJids: ['group-id'], type: 'text', text: 'hello' });
    expect(mockClient.post).toHaveBeenCalledWith('/groups/group-id/participants', { participants: ['1234'], action: 'add' });
  });

  it('ScheduledResource methods route to the right client methods', async () => {
    const scheduled = new ScheduledResource(mockClient as any);
    await scheduled.list();
    await scheduled.update('id-123', { text: 'updated' });
    await scheduled.cancel('id-123');

    expect(mockClient.get).toHaveBeenCalledWith('/scheduled-messages');
    expect(mockClient.patch).toHaveBeenCalledWith('/scheduled-messages/id-123', { text: 'updated' });
    expect(mockClient.delete).toHaveBeenCalledWith('/scheduled-messages/id-123');
  });

  it('ChannelsResource methods route to the correct endpoints', async () => {
    const channels = new ChannelsResource(mockClient as any);
    await channels.send('newsletter@newsletter', { type: 'text', text: 'hello' });
    await channels.sendFile('newsletter@newsletter', { type: 'file', file: new Blob(['x'], { type: 'text/plain' }), fileName: 'x.txt' });
    await channels.getById('newsletter@newsletter');
    await channels.getByInviteCode('invite-code');
    await channels.create({ name: 'News', description: 'Updates' });
    await channels.update('newsletter@newsletter', { name: 'Updated' });
    await channels.follow('newsletter@newsletter');
    await channels.unfollow('newsletter@newsletter');

    expect(mockClient.post).toHaveBeenCalledWith('/channels/newsletter@newsletter/message', { type: 'text', text: 'hello' });
    expect(mockClient.post).toHaveBeenCalledWith('/channels/newsletter@newsletter/message', expect.any(FormData));
    expect(mockClient.get).toHaveBeenCalledWith('/channels/newsletter@newsletter');
    expect(mockClient.get).toHaveBeenCalledWith('/channels/invite/invite-code');
    expect(mockClient.post).toHaveBeenCalledWith('/channels', { name: 'News', description: 'Updates' });
    expect(mockClient.put).toHaveBeenCalledWith('/channels/newsletter@newsletter', { name: 'Updated' });
    expect(mockClient.post).toHaveBeenCalledWith('/channels/newsletter@newsletter/follow');
    expect(mockClient.post).toHaveBeenCalledWith('/channels/newsletter@newsletter/unfollow');
  });

  it('WebhooksResource validates and parses webhooks', () => {
    const webhooks = new WebhooksResource();
    expect(webhooks.validateSignature('payload', 'sig', 'secret')).toBe(true);
    expect(webhooks.parseEvent({ event: 'test' })).toEqual({ event: 'test' });
  });
});
