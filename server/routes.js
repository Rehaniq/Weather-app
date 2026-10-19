import { Router } from 'express';
import { pool } from './db.js';
import { searchCities, getForecast } from './weatherService.js';

const router = Router();


router.get('/geocode', async (req, res) => {
  const q = (req.query.q ?? '').trim();
  if (q.length < 2) return res.json([]);
  try {
    res.json(await searchCities(q));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});


router.get('/weather', async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ error: 'lat and lon must be numbers' });
  }
  try {
    res.json(await getForecast(lat, lon));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});


router.get('/favorites', async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM favorites ORDER BY created_at DESC'
  );
  res.json(rows);
});


router.post('/favorites', async (req, res) => {
  const { name, country, latitude, longitude } = req.body;
  if (!name || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'name, latitude, longitude required' });
  }
  const { rows } = await pool.query(
    `INSERT INTO favorites (name, country, latitude, longitude)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (latitude, longitude) DO UPDATE SET name = EXCLUDED.name
     RETURNING *`,
    [name, country, latitude, longitude]
  );
  res.status(201).json(rows[0]);
});

// DELETE /api/favorites/:id
router.delete('/favorites/:id', async (req, res) => {
  await pool.query('DELETE FROM favorites WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

export default router;