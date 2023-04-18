const express = require('express');
const {Pool} = require('pg');
const middlewareRouter = require('../middlewares/router');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

router.use(middlewareRouter);

router.delete('/watchlist/movie/:userId/:movieId', async (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;
  const id = req.params.id;
  try {
    await pool.query(
      `DELETE FROM user_watchlist WHERE user_id=$1 AND movie_id=$2`,
      [userId, movieId]
    );
    await pool.query (
      `DELETE FROM user_watchlist WHERE user_id=$1 AND movie_id IN (SELECT id FROM movies WHERE movie_id=$2);`,
      [userId, id]
    );
    await pool.query(
      `DELETE FROM movies WHERE id=$1 AND NOT EXISTS (SELECT 1 FROM user_watchlist WHERE movie_id=$1)`,
      [movieId]
      );
    if (res.rowCount === 0) {
      res.status(404).json({message: 'Media Not Found In Watchlist'});
    } else {
      res.status(200).json({message: 'Media Removed From Watchlist'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error Removing Media From Watchlist'});
  }
});

router.delete('/watchlist/tvshow/:userId/:tvShowId', async (req, res) => {
  const userId = req.params.userId;
  const tvShowId = req.params.tvShowId;
  const id = req.params.id;
  try {
    await pool.query(
      `DELETE FROM user_watchlist WHERE user_id=$1 AND tv_show_id=$2`,
      [userId, tvShowId]
    );
    await pool.query (
      `DELETE FROM user_watchlist WHERE user_id=$1 AND tv_show_id IN (SELECT id FROM tv_shows WHERE tv_show_id=$2);`,
      [userId, id]
    );
    await pool.query(
      `DELETE FROM tv_shows WHERE id=$1 AND NOT EXISTS (SELECT 1 FROM user_watchlist WHERE tv_show_id=$1)`,
      [tvShowId]
    );
    if (res.rowCount === 0) {
      res.status(404).json({message: 'Media Not Found In Watchlist'});
    } else {
      res.status(200).json({message: 'Media Removed From Watchlist'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error Removing Media From Watchlist'});
  }
});

module.exports = router;