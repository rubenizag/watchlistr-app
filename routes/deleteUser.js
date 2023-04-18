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

router.delete('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);
    req.session.destroy();
    res.status(200).json({message: 'Account Deleted'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error Deleting Account'});
  }
});

module.exports = router;