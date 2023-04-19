const express = require('express');
const {Pool} = require('pg');
const middlewareRouter = require('../middlewares/router');

const router = express.Router();
const pool = new Pool({
  connectionString: 'postgresql:///watchlistr_db',
});

router.use(middlewareRouter);

router.post('/watchlist/:userId/:movieId', async (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;

  try {
    await pool.query(
      `INSERT INTO user_watchlist (user_id, movie_id) VALUES ($1, $2)`,
      [userId, movieId]
    );
    res.status(200).json({message: 'Movie Added To Watchlist'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error Adding Movie To Watchlist'});
  }
});

module.exports = router;