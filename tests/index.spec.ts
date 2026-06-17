import { describe, expect, it } from 'vitest';
import { Flaresend, FlaresendClient } from '../src/index';

describe('Flaresend SDK', () => {
  it('constructs with resources and alias is exported', () => {
    const client = new Flaresend('test-key');

    expect(client.messages).toBeDefined();
    expect(client.scheduled).toBeDefined();
    expect(client.groups).toBeDefined();
    expect(client.channels).toBeDefined();
    expect(client.webhooks).toBeDefined();
    expect(FlaresendClient).toBe(Flaresend);
  });
});
