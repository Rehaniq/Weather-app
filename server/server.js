import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './routes.js';
import { initDb } from './db.js';



const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());


app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', router);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});