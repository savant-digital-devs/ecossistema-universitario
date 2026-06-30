import express from 'express';

const app = express();
const PORT = process.env.PORT || 3333;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});