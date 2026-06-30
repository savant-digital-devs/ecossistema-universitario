import { redis } from './redis-client';

export const redisCacheClient = {
  async set(key: string, value: string, mode: 'EX', ttl: number): Promise<void> {
    await redis.set(key, value, mode, ttl);
  },

  async get(key: string): Promise<string | null> {
    return redis.get(key);
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },
};
