const express = require('express');
const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'testing123';
const middlewareRouter = require('../middlewares/router');

// Create a new Pool instance to connect to the PostgreSQL database
const pool = new Pool({
  connectionString: 'postgresql:///watchlistr_db',
});

const router = express.Router();
// Middleware used to define global middleware functions that are applied to all routes in the router
router.use(middlewareRouter);

// Route for user signup
router.post('/signup', async (req, res) => {
  const {username, password} = req.body;
  try {
    // Generate a salt for password hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // Insert the new user into the database and return the user data
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    const user = result.rows[0];
    // Generate a JWT token to authenticate the user
    const token = jwt.sign({userId: user.id}, secret);
    // Send success response with user data and JWT token
    res.send({
      message: `User ${username} Created Successfully`,
      user: {id: user.id, username: user.username},
      token,
    });
  } catch (err) {
    console.error(err);
    const errorMessage =
      err.message || 'An Error Occurred While Creating The User';
    res.status(500).send({error: errorMessage});
  }
});

module.exports = router;