import { env } from '../config/env';

export const queueConnection = {
  url: env.REDIS_URL,
};