export class FakeRedisClient {
  private store = new Map<string, { value: string; expiresAt: number }>();

  async set(key: string, value: string, mode: 'EX', ttl: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}
