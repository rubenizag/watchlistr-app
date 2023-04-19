const express = require('express');
const {Pool} = require('pg');
const middlewareRouter = require('../middlewares/router');

const router = express.Router();
const pool = new Pool({
  connectionString: 'postgresql:///watchlistr_db',
});

router.use(middlewareRouter);

router.post('/user-watchlist-tv-show', async (req, res) => {
  const {tvShowId, name, runtime, airDates, posterPath, overview, userId} = req.body;
  console.log(req.body)
  try {
    const {rows} = await pool.query('SELECT id FROM tv_shows WHERE tv_show_id = $1', [tvShowId]);
    let tvShowIdFromDb;
    if (rows.length > 0) {
      tvShowIdFromDb = rows[0].id;
    } else {
      const {rows: [tvShow]} = await pool.query(
        'INSERT INTO tv_shows (tv_show_id, name, runtime, air_dates, poster_path, overview) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [tvShowId, name, runtime, airDates, posterPath, overview]
      );
      tvShowIdFromDb = tvShow.id;
    }
    await pool.query('INSERT INTO user_watchlist (user_id, tv_show_id) VALUES ($1, $2)', [userId, tvShowIdFromDb]);
    res.status(201).json({message: 'TV Show Added To Watchlist'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error Adding TV Show To Watchlist'});
  }
});

module.exports = router;