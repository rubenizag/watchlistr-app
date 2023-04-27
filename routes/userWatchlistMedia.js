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

// Route for adding a movie to the watchlist
router.post('/user-watchlist-movie', async (req, res) => {
  try {
    const {movieId, userId} = req.body;

    const movie = await getOrCreateMovie(movieId, req.body);
    await addUserMovieWatchlist(movie.id, userId);

    res.status(201).json({message: 'Movie Added To Watchlist'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error Adding Movie To Watchlist'});
  }
});

// Route for adding a tv show to the watchlist
router.post('/user-watchlist-tv-show', async (req, res) => {
  try {
    const {tvShowId, userId} = req.body;

    const tvShow = await getOrCreateTvShow(tvShowId, req.body);
    await addUserTvShowWatchlist(tvShow.id, userId);

    res.status(201).json({message: 'TV Show Added To Watchlist'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error Adding TV Show To Watchlist'});
  }
});

// Function to get or create a movie in the database
async function getOrCreateMovie(movieId, data) {
  // Check if the movie already exists in the database by looking up its ID
  const {rows} = await pool.query('SELECT id FROM movies WHERE movie_id = $1', [movieId]);

  if (rows.length > 0) {
    // If the movie already exists, return its ID
    return { id: rows[0].id };
  } else {
    // If the movie doesn't exist, create a new entry in the database and return its ID
    const {rows: [movie]} = await pool.query(
      'INSERT INTO movies (movie_id, title, runtime, release_date, poster_path, overview) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [movieId, data.title, data.runtime, data.releaseDate, data.posterPath, data.overview]
    );
    return movie;
  }
}

// Function to get or create a tv show in the database
async function getOrCreateTvShow(tvShowId, data) {
  // Check if the tv show already exists in the database by looking up its ID
  const {rows} = await pool.query('SELECT id FROM tv_shows WHERE tv_show_id = $1', [tvShowId]);

  if (rows.length > 0) {
    // If the tv show already exists, return its ID
    return {id: rows[0].id};
  } else {
    // If the tv show doesn't exist, create a new entry in the database and return its ID
    const {rows: [tvShow]} = await pool.query(
      'INSERT INTO tv_shows (tv_show_id, name, runtime, air_dates, poster_path, overview) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [tvShowId, data.name, data.runtime, data.airDates, data.posterPath, data.overview]
    );
    return tvShow;
  }
}

// Function to add a movie to a user's watchlist
async function addUserMovieWatchlist(movieId, userId) {
  // Insert the movie ID and user ID into the user_watchlist table
  await pool.query('INSERT INTO user_watchlist (user_id, movie_id) VALUES ($1, $2)',[userId, movieId]);
}

// Function to add a tv show to a user's watchlist
async function addUserTvShowWatchlist(tvShowId, userId) {
  // Insert the tv show ID and user ID into the user_watchlist table
  await pool.query('INSERT INTO user_watchlist (user_id, tv_show_id) VALUES ($1, $2)', [userId, tvShowId]);
}

module.exports = router;