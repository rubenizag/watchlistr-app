const express = require('express');
const {Pool} = require('pg');
const middlewareRouter = require('../middlewares/router');

const router = express.Router();
const pool = new Pool({
  connectionString: 'postgresql:///watchlistr_db',
});

router.use(middlewareRouter);

router.post('/watchlist/:userId/:tvShowId', async (req, res) => {
  const userId = req.params.userId;
  const tvShowId = req.params.tvShowId;

  try {
    await pool.query(
      `INSERT INTO user_watchlist (user_id, tv_show_id) VALUES ($1, $2)`,
      [userId, tvShowId]
    );
    res.status(200).json({message: 'TV Show Added To Watchlist'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error Adding TV Show To Watchlist'});
  }
});

module.exports = router;