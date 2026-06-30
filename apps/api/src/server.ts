import express from 'express';
import { prisma } from './infra/database/prisma-client';
import { env } from './infra/config/env';

const app = express();

app.get('/health', async (_req, res) => {
  const userCount = await prisma.user.count();
  res.json({ status: 'ok', usersInDatabase: userCount });
});

app.listen(env.PORT, () => {
  console.log(`API rodando na porta ${env.PORT}`);
});