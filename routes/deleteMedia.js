const express = require('express');
const {Pool} = require('pg');
const middlewareRouter = require('../middlewares/router');

// Create a new Pool instance to connect to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const router = express.Router();
// Middleware used to define global middleware functions that are applied to all routes in the router
router.use(middlewareRouter);

// Route for removing a movie from the watchlist
router.delete('/watchlist/movie/:userId/:movieId', async (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;
  const id = req.params.id;
  try {
    // Remove the movie from the user's watchlist
    await pool.query(
      `DELETE FROM user_watchlist WHERE user_id=$1 AND movie_id=$2`,
      [userId, movieId]
    );
    // Remove the movie from the watchlist if no other users have it on their watchlist
    await pool.query (
      `DELETE FROM user_watchlist WHERE user_id=$1 AND movie_id IN (SELECT id FROM movies WHERE movie_id=$2);`,
      [userId, id]
    );
    await pool.query(
      `DELETE FROM movies WHERE id=$1 AND NOT EXISTS (SELECT 1 FROM user_watchlist WHERE movie_id=$1)`,
      [movieId]
    );
    // Return an error if the movie was not found in the user's watchlist
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

// Route for removing a TV show from the watchlist
router.delete('/watchlist/tvshow/:userId/:tvShowId', async (req, res) => {
  const userId = req.params.userId;
  const tvShowId = req.params.tvShowId;
  const id = req.params.id;
  try {
    // Remove the TV show from the user's watchlist
    await pool.query(
      `DELETE FROM user_watchlist WHERE user_id=$1 AND tv_show_id=$2`,
      [userId, tvShowId]
    );
    // Remove the TV show from the watchlist if no other users have it on their watchlist
    await pool.query (
      `DELETE FROM user_watchlist WHERE user_id=$1 AND tv_show_id IN (SELECT id FROM tv_shows WHERE tv_show_id=$2);`,
      [userId, id]
    );
    await pool.query(
      `DELETE FROM tv_shows WHERE id=$1 AND NOT EXISTS (SELECT 1 FROM user_watchlist WHERE tv_show_id=$1)`,
      [tvShowId]
    );
    // Return an error if the TV show was not found in the user's watchlist
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