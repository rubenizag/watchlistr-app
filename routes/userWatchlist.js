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

router.route('/watchlist/movies/:userId')
  .get(async (req, res) => {
    const userId = req.params.userId;
    try {
      const result = await pool.query(
        `SELECT
           movies.id,
           movies.movie_id,
           movies.title,
           movies.runtime,
           movies.release_date,
           movies.poster_path,
           movies.overview
         FROM
           user_watchlist
           INNER JOIN movies ON user_watchlist.movie_id = movies.id
         WHERE
           user_id = $1`,
        [userId]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({message:'Error Retrieving Movies Watchlist'});
    }
  });

router.route('/watchlist/tvshows/:userId')
  .get(async (req, res) => {
    const userId = req.params.userId;
    try {
      const result = await pool.query(
        `SELECT
           tv_shows.id,
           tv_shows.tv_show_id,
           tv_shows.name,
           tv_shows.runtime,
           tv_shows.air_dates,
           tv_shows.poster_path,
           tv_shows.overview
         FROM
           user_watchlist
           INNER JOIN tv_shows ON user_watchlist.tv_show_id = tv_shows.id
         WHERE
           user_id = $1`,
        [userId]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({message:'Error Retrieving TV Shows Watchlist'});
    }
});

module.exports = router;