import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../src/utils/http';
import {
  AuthenticationError,
  FlaresendError,
  InstanceNotReadyError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from '../src/utils/errors';

describe('HttpClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds authorization and content-type for JSON requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'ok' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const client = new HttpClient({ apiKey: 'test-key', baseUrl: 'https://example.com' });
    const result = await client.post('/test', { hello: 'world' });

    expect(result).toEqual({ data: 'ok' });
    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://example.com/test');
    expect(options.method).toBe('POST');
    expect(options.headers).toMatchObject({
      Authorization: 'Bearer test-key',
      'Content-Type': 'application/json',
    });
    expect(options.body).toBe(JSON.stringify({ hello: 'world' }));
  });

  it('does not set Content-Type when sending FormData', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'ok' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const client = new HttpClient({ apiKey: 'test-key' });
    const formData = new FormData();
    formData.append('field', 'value');

    await client.post('/form', formData);
    const [, options] = mockFetch.mock.calls[0];

    expect(options.headers).toMatchObject({ Authorization: 'Bearer test-key' });
    expect(options.headers['Content-Type']).toBeUndefined();
  });

  it.each([
    [401, AuthenticationError],
    [400, ValidationError],
    [403, ForbiddenError],
    [404, NotFoundError],
    [425, InstanceNotReadyError],
    [500, FlaresendError],
  ])('maps HTTP %i to the correct SDK error', async (status, ErrorClass) => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status,
      json: vi.fn().mockResolvedValue({ message: 'oops' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const client = new HttpClient({ apiKey: 'test-key' });
    await expect(client.get('/error')).rejects.toBeInstanceOf(ErrorClass);
  });
});
