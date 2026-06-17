# Flaresend JavaScript SDK

Official JavaScript/TypeScript SDK for the [Flaresend](https://flaresend.com) WhatsApp Messaging API.

## Installation

```bash
npm install flaresend
# or
yarn add flaresend
# or
pnpm add flaresend
```

## Features

- **Type-safe API**: Fully typed requests and responses.
- **Resource-based**: Intuitive organization (messages, groups, channels, scheduled).
- **Minimal Dependencies**: Zero runtime dependencies, tree-shakable and minified + gzipped.
- **Dual Output**: Supports both ESM and CommonJS.

## Quick Start

```typescript
import { Flaresend } from "flaresend";

const flaresend = new Flaresend("YOUR_API_KEY");

// Send a simple text message
const result = await flaresend.messages.send({
  recipients: ["254712345678"],
  type: "text",
  text: "Hello from Flaresend SDK!",
});

console.log(result.success ? "Message sent!" : "Failed to send");
```

## Usage

### Messaging

#### Send Image (via URL)

```typescript
await flaresend.messages.send({
  recipients: ["254712345678"],
  type: "image",
  url: "https://example.com/image.jpg",
  caption: "Beautiful sunset!",
});
```

#### Send File (using FormData - Browser/Node)

```typescript
// Assuming you have a File or Blob object
await flaresend.messages.sendFile({
  recipients: ["254712345678"],
  type: "document",
  file: myFileBlob,
  fileName: "report.pdf",
});
```

### Scheduled Messages

#### Schedule a message

```typescript
const scheduled = await flaresend.messages.schedule({
  recipients: ["254712345678"],
  type: "text",
  text: "Happy Birthday!",
  sendAt: "2025-11-14 13:48:00",
});
```

#### List scheduled messages

```typescript
const list = await flaresend.scheduled.list();
```

### Group Management

#### Create a group

```typescript
const group = await flaresend.groups.create({
  subject: "Dev Team",
  participants: ["254712345678", "254722334455"],
});
```

#### Send message to groups

```typescript
await flaresend.groups.sendMessage({
  groupJids: ["120363403582097887@g.us"],
  type: "text",
  text: "Meeting in 10 minutes!",
});
```

### Channels

#### Send a channel message

```typescript
await flaresend.channels.send("120363406469149890@newsletter", {
  type: "text",
  text: "Hello everyone 👋",
});
```

#### Send a channel file upload

```typescript
await flaresend.channels.sendFile("120363406469149890@newsletter", {
  type: "document",
  file: myFileBlob,
  fileName: "announcement.pdf",
  caption: "Monthly newsletter",
});
```

#### Get channel metadata

```typescript
const channel = await flaresend.channels.getById("120363406469149890@newsletter");
```

#### Get channel metadata by invite code

```typescript
const inviteChannel = await flaresend.channels.getByInviteCode("0029VanAL05IHphM6gyJ7h02");
```

#### Create/update/follow/unfollow a channel

```typescript
await flaresend.channels.create({
  name: "Engineering 55",
  description: "Product updates and team news",
});

await flaresend.channels.update("120363406469149890@newsletter", {
  name: "Engineering Updates",
  description: "Weekly technical announcements",
});

await flaresend.channels.follow("120363406469149890@newsletter");
await flaresend.channels.unfollow("120363406469149890@newsletter");
```

## Webhooks

Flaresend webhook delivery is configured in your Flaresend account dashboard. The SDK does not register webhook URLs for you; instead, set your webhook endpoint in the dashboard and handle incoming events in your application.

#### Handle incoming webhook events

```typescript
import express from 'express';
import { Flaresend } from 'flaresend';

const app = express();
app.use(express.json());

const flaresend = new Flaresend('YOUR_API_KEY');

app.post('/webhooks/flaresend', (req, res) => {
  const event = flaresend.webhooks.parseEvent(req.body);

  // Handle incoming event payload here
  console.log('Incoming event', event);

  res.status(200).json({ status: 'received' });
});
```

#### Signature validation

The current SDK includes a placeholder `validateSignature` helper for webhook signature verification. If your Flaresend webhook configuration includes a signature secret, implement the verification logic in your own application or extend the resource once Flaresend publishes the exact HMAC details.

```typescript
const isValid = flaresend.webhooks.validateSignature(JSON.stringify(req.body), signatureHeader, secret);
```

## Error Handling

The SDK provides custom error classes for better error handling:

```typescript
import { Flaresend, AuthenticationError, InstanceNotReadyError } from 'flaresend';

try {
  const flaresend = new Flaresend('INVALID_KEY');
  await flaresend.messages.send({...});
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API Key');
  } else if (error instanceof InstanceNotReadyError) {
    console.error('WhatsApp instance not connected');
  }
}
```

## Architecture

```mermaid
graph TD
    A[Flaresend Client] --> B[Messages Resource]
    A --> C[Groups Resource]
    A --> D[Scheduled Resource]
    A --> H[Channels Resource]
    A --> E[Webhooks Resource]
    B --> F[HttpClient]
    C --> F
    D --> F
    H --> F
    F --> G[Flaresend API]
```

## License

MIT
