import { HttpClient, HttpClientOptions } from './utils/http';
import { MessagesResource } from './resources/messages';
import { ScheduledResource } from './resources/scheduled';
import { GroupsResource } from './resources/groups';
import { ChannelsResource } from './resources/channels';
import { WebhooksResource } from './resources/webhooks';

export class Flaresend {
    private client: HttpClient;

    public messages: MessagesResource;
    public scheduled: ScheduledResource;
    public groups: GroupsResource;
    public channels: ChannelsResource;
    public webhooks: WebhooksResource;

    constructor(apiKey: string, options: Partial<HttpClientOptions> = {}) {
        this.client = new HttpClient({
            apiKey,
            ...options
        });

        this.messages = new MessagesResource(this.client);
        this.scheduled = new ScheduledResource(this.client);
        this.groups = new GroupsResource(this.client);
        this.channels = new ChannelsResource(this.client);
        this.webhooks = new WebhooksResource();
    }
}

// Alias for clean export
export const FlaresendClient = Flaresend;
