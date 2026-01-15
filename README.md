# Flaresend TypeScript SDK

## 1. **Core Architecture**

```
flaresend-sdk/
├── src/
│   ├── index.ts                 # Main export
│   ├── client.ts                # FlaresendClient class
│   ├── resources/               # Resource modules
│   │   ├── messages.ts
│   │   ├── scheduled.ts
│   │   ├── groups.ts
│   │   └── webhooks.ts
│   ├── types/                   # TypeScript types
│   │   ├── messages.ts
│   │   ├── groups.ts
│   │   └── common.ts
│   └── utils/
│       ├── http.ts              # HTTP client wrapper
│       └── errors.ts            # Custom error classes
```

## 2. **Design Principles**

### **Readable API Surface**
```typescript
const flaresend = new Flaresend('YOUR_API_KEY');

// Clean, intuitive methods
await flaresend.messages.send({...});
await flaresend.messages.schedule({...});
await flaresend.scheduled.list();
await flaresend.groups.create({...});
```

### **Resource-Based Organization**
- Each API domain (messages, groups, scheduled) gets its own resource class
- Resources are accessible via the main client
- Methods mirror API endpoints naturally

## 3. **Key Implementation Details**

### **HTTP Client Layer**
- Wrap `fetch` or `axios` with auth header injection
- Handle errors uniformly (401, 400, 425, etc.)
- Type-safe request/response handling

### **Type Safety**
```typescript
// Strong typing for all request/response objects
interface SendMessageRequest {
  recipients: string[];
  type: 'text' | 'image' | 'video' | 'document' | 'audio';
  text?: string;
  url?: string;
  caption?: string;
  fileName?: string;
}

interface SendMessageResponse {
  success: boolean;
  message: string;
  sent_at: string;
  total_recipients: number;
  successful_recipients: string[];
  failed_recipients: string[];
  invalid_recipients: string[];
}
```

### **Error Handling**
```typescript
class FlaresendError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {}
}

class AuthenticationError extends FlaresendError {}
class InstanceNotReadyError extends FlaresendError {}
```

## 4. **Resource Implementation Pattern**

Each resource follows this pattern:

```typescript
class MessagesResource {
  constructor(private client: HttpClient) {}
  
  async send(params: SendMessageRequest): Promise<SendMessageResponse> {
    return this.client.post('/send-message', params);
  }
  
  async schedule(params: ScheduleMessageRequest): Promise<ScheduleResponse> {
    return this.client.post('/schedule-message', params);
  }
}
```

## 5. **File Upload Handling**

For document/image uploads, provide both approaches:
```typescript
// URL-based
await flaresend.messages.send({
  recipients: ['254712345678'],
  type: 'image',
  url: 'https://example.com/image.jpg'
});

// File-based (with FormData)
await flaresend.messages.sendFile({
  recipients: ['254712345678'],
  type: 'document',
  file: fileBuffer, // or File object in browser
  fileName: 'report.pdf'
});
```

## 6. **Webhook Validation Helper**

```typescript
class WebhooksResource {
  validateSignature(payload: string, signature: string): boolean {
    // HMAC validation if Flaresend provides it
  }
  
  parseEvent(body: any): WebhookEvent {
    // Type-safe event parsing
  }
}
```

## 7. **Build & Distribution**

- **Bundler**: Use `tsup` or `rollup` for dual ESM/CJS output
- **Package exports**:
  ```json
  {
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts"
  }
  ```
- **Zero dependencies** for core (only dev deps for build)

## 8. **Developer Experience Enhancements**

### **Method Chaining Where Appropriate**
```typescript
const message = await flaresend.messages
  .to(['254712345678'])
  .text('Hello!')
  .send();
```

### **Helpful Defaults**
- Automatic phone number formatting (add country code if missing)
- Retry logic for transient failures
- Clear error messages

### **TypeScript Utilities**
```typescript
// Helper for group IDs
type GroupJid = `${string}@g.us`;

// Helper for phone numbers
type PhoneNumber = `${number}` | string;
```

## 9. **Testing Strategy**

- Mock HTTP layer for unit tests
- Provide test fixtures for all response types
- Integration tests against sandbox (if available)

## 10. **Minimal MVP Features**

**Phase 1 (Core)**:
- ✅ Send text messages
- ✅ Send media (URL-based)
- ✅ Schedule messages
- ✅ Group management
- ✅ Error handling

**Phase 2 (Enhanced)**:
- File uploads via FormData
- Webhook validation
- Retry logic
- Rate limiting helpers

## 11. **Example Usage**

```typescript
import { Flaresend } from 'flaresend';

const client = new Flaresend('YOUR_API_KEY');

// Send message
const result = await client.messages.send({
  recipients: ['254712345678'],
  type: 'text',
  text: 'Hello from SDK!'
});

// Create group
const group = await client.groups.create({
  subject: 'Team Chat',
  participants: ['254712345678', '254798765432']
});

// Schedule message
await client.messages.schedule({
  recipients: ['254712345678'],
  type: 'text',
  text: 'Reminder!',
  sendAt: '2025-11-14 13:48:00'
});
```

---
