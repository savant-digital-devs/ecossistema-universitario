import { Worker } from 'bullmq';
import { queueConnection } from '../queue-connection';

export type EmailJobData = {
  to: string;
  subject: string;
  body: string;
};

export const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job) => {
    const { to, subject, body } = job.data;

    // aqui vai entrar o SMTP real na Fase 3
    console.log(`Enviando e-mail para ${to}: ${subject}\n${body}`);
  },
  { connection: queueConnection },
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} concluído com sucesso`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} falhou:`, err.message);
});
