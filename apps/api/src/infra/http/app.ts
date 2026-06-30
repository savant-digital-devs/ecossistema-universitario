import express, { type Express } from 'express';
import { errorHandler } from './middlewares/error-handler';
import { prisma } from '../database/prisma-client';
import '../queue/workers/email-worker';

export const app: Express = express();

app.use(express.json());

app.get('/health', async (_req, res) => {
  const userCount = await prisma.user.count();
  res.json({ status: 'ok', usersInDatabase: userCount });
});

app.use(errorHandler);