# SDK Test Coverage

This repository includes unit tests for the Flaresend SDK.

## Test setup

- Uses `vitest` for test execution.
- Configuration is defined in `vitest.config.ts`.
- Tests live under the `tests/` folder.

## Test files

### `tests/http-client.spec.ts`

Covers the HTTP client behavior in `src/utils/http.ts`:
- verifies that requests include the correct `Authorization` header
- ensures JSON requests automatically set `Content-Type: application/json`
- confirms `FormData` requests do not override `Content-Type`
- checks HTTP error status codes are mapped to the correct SDK error classes:
  - `AuthenticationError` for 401
  - `ValidationError` for 400
  - `ForbiddenError` for 403
  - `NotFoundError` for 404
  - `InstanceNotReadyError` for 425
  - `FlaresendError` for other failures

### `tests/resources.spec.ts`

Validates resource wrappers for the SDK resources:
- `MessagesResource` sends regular and file-based message requests correctly
- `MessagesResource.schedule` forwards scheduling payloads correctly
- `GroupsResource` forwards create, list, get, invite link, send message, and manage participants calls
- `ScheduledResource` routes list, update, and cancel operations correctly
- `ChannelsResource` routes send, sendFile, getById, getByInviteCode, create, update, follow, and unfollow operations correctly
- `WebhooksResource` placeholder signature validation and event parsing behavior

### `tests/index.spec.ts`

Validates the main SDK export in `src/index.ts`:
- confirms the `Flaresend` constructor builds resources
- confirms the `FlaresendClient` alias exports the same class

## Running tests

- `pnpm test` — run all tests once
- `pnpm test:watch` — run tests in watch mode

## Notes

These tests are focused on SDK internals and request routing, using mocked `fetch` and HTTP client methods rather than making live network requests.