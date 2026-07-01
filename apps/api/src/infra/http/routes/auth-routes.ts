import { IRouter, Router, type Request, type Response } from 'express';
import { RegisterUserUseCase } from '../../../modules/academic/use-cases/register-user-use-case';
import { AuthenticateUserUseCase } from '../../../modules/academic/use-cases/authenticate-user-use-case';
import { RefreshTokenUseCase } from '../../../modules/academic/use-cases/refresh-token-use-case';
import { ForgotPasswordUseCase } from '../../../modules/academic/use-cases/forgot-password-use-case';
import { ResetPasswordUseCase } from '../../../modules/academic/use-cases/reset-password-use-case';
import { PrismaUserRepository } from '../../database/repositories/academic/prisma-user-repository';
import { PrismaSessionRepository } from '../../database/repositories/academic/prisma-session-repository';
import { redisCacheClient } from '../../cache/redis-cache-client';

const router: IRouter = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, cpf } = req.body;

  const userRepository = new PrismaUserRepository();
  const useCase = new RegisterUserUseCase(userRepository);

  const result = await useCase.execute({ name, email, password, cpf });

  res.status(201).json(result);
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userRepository = new PrismaUserRepository();
  const sessionRepository = new PrismaSessionRepository();
  const useCase = new AuthenticateUserUseCase(userRepository, sessionRepository);

  const result = await useCase.execute({ email, password });

  res.json(result);
});

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const userRepository = new PrismaUserRepository();
  const sessionRepository = new PrismaSessionRepository();
  const useCase = new RefreshTokenUseCase(userRepository, sessionRepository);

  const result = await useCase.execute({ refreshToken });

  res.json(result);
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  const userRepository = new PrismaUserRepository();
  const useCase = new ForgotPasswordUseCase(userRepository, redisCacheClient);

  await useCase.execute({ email });

  res.status(204).send();
});

router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const userRepository = new PrismaUserRepository();
  const useCase = new ResetPasswordUseCase(userRepository, redisCacheClient);

  await useCase.execute({ token, newPassword });

  res.status(204).send();
});

export { router as authRoutes };
