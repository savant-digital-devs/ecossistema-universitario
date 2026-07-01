import { app } from './infra/http/app';
import { env } from './infra/config/env';

app.listen(env.PORT, () => {
  console.warn(`API rodando na porta ${env.PORT}`);
});
