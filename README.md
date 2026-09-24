# Flaresend SDK

An unofficial, type-safe JavaScript/TypeScript SDK for the Flaresend WhatsApp Messaging API.

## Installation

```bash
npm install flaresend

# or
yarn add flaresend

# or
pnpm add flaresend
```

## Features

* **Type-safe API**: Fully typed requests and responses for a better developer experience.
* **Resource-based API**: Intuitive resource organization for messages, groups, channels, and scheduled messages.
* **Zero Runtime Dependencies**: Lightweight by design with no production dependencies.
* **Tree-shakable**: ESM output enables modern bundlers to eliminate unused code.
* **Dual Output**: Supports both ESM and CommonJS environments.

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
  type: "document", // "image" | "video" | "document" | "audio" | "template"
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

## License

MIT
