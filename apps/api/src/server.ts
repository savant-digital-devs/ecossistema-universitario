import { app } from './infra/http/app';
import { env } from './infra/config/env';

app.listen(env.PORT, () => {
  console.log(`API rodando na porta ${env.PORT}`);
});
