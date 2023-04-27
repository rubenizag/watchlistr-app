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

// Route for deleting a user account
router.delete('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Delete the user from the database & destroy session
    await pool.query('DELETE FROM users WHERE id=$1', [userId]);
    req.session.destroy();
    res.status(200).json({message: 'Account Deleted'});
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || 'Error Deleting Account';
    res.status(500).json({message: errorMessage});
  }
});

module.exports = router;