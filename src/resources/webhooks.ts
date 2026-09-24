export class WebhooksResource {
    /**
     * Parse a webhook event with type safety
     */
    parseEvent<T = any>(body: any): T {
        return body as T;
    }
}
