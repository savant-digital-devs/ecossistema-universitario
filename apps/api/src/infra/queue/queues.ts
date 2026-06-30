import { Queue } from 'bullmq';
import { queueConnection } from './queue-connection';

export const emailQueue = new Queue('email', {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});
