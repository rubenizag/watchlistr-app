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

// Route for adding a movie to the user's watchlist
router.post('/watchlist/movie/:userId/:movieId', async (req, res) => {
  try {
    const {userId, movieId} = req.params;
    // Call the addUserWatchlist function to add the movie to the user's watchlist
    await addUserWatchlist(movieId, userId);
    res.status(200).json({message: 'Movie Added To Watchlist'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error Adding Movie To Watchlist'});
  }
});

// Function to add a movie to the user's watchlist
async function addUserWatchlist(movieId, userId) {
  // Insert the movie ID and user ID into the user_watchlist table
  await pool.query('INSERT INTO user_watchlist (user_id, movie_id) VALUES ($1, $2)', [userId, movieId]);
}

// Route for adding a tv show to the user's watchlist
router.post('/watchlist/tvshow/:userId/:tvShowId', async (req, res) => {
  try {
    const {userId, tvShowId} = req.params;
    // Call the addUserWatchlist function to add the tv show to the user's watchlist
    await addUserWatchlist(tvShowId, userId);
    res.status(200).json({message: 'TV Show Added To Watchlist'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error Adding TV Show To Watchlist'});
  }
});

// Function to add a tv show to the user's watchlist
async function addUserWatchlist(tvShowId, userId) {
  // Insert the tv show ID and user ID into the user_watchlist table
  await pool.query('INSERT INTO user_watchlist (user_id, tv_show_id) VALUES ($1, $2)', [userId, tvShowId]);
}

module.exports = router;