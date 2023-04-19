const express = require('express');
const {Pool} = require('pg');
const middlewareRouter = require('../middlewares/router');

const router = express.Router();
const pool = new Pool({
  connectionString: 'postgresql:///watchlistr_db',
});

router.use(middlewareRouter);

router.post('/user-watchlist-movie', async (req, res) => {
  const {movieId, title, runtime, releaseDate, posterPath, overview, userId} = req.body;
  console.log(req.body)
  try {
    const {rows} = await pool.query('SELECT id FROM movies WHERE movie_id = $1', [movieId]);
    let movieIdFromDb;
    if (rows.length > 0) {
      movieIdFromDb = rows[0].id;
    } else {
      const {rows: [movie]} = await pool.query(
        'INSERT INTO movies (movie_id, title, runtime, release_date, poster_path, overview) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [movieId, title, runtime, releaseDate, posterPath, overview]
      );
      movieIdFromDb = movie.id;
    }
    await pool.query('INSERT INTO user_watchlist (user_id, movie_id) VALUES ($1, $2)', [userId, movieIdFromDb]);
    res.status(201).json({message: 'Movie Added To Watchlist'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error Adding Movie To Watchlist'});
  }
});

module.exports = router;