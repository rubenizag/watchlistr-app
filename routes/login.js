const express = require('express');
const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'testing123';
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

// Route for user login
router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  try {
    // Get the user from the database using the provided username
    const result = await pool.query(
      'SELECT id, username, password FROM users WHERE username=$1',
      [username]
    );
    const user = result.rows[0];
    if (!user) {
      throw new Error('Invalid Username');
    }
    // Check if the provided password matches the user's hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid Password');
    }
    // Set the user's ID in the session and create a JWT token for authentication
    req.session.userId = user.id;
    const token = jwt.sign({userId: user.id}, secret);
    // Send the user's information and token in the response
    res.send({
      message: 'Login Successful',
      userId: user.id,
      username: user.username,
      token,
    });
  } catch (err) {
    console.error(err);
    const errorMessage = err.message || 'An Error Occurred While Logging In.';
    res.status(401).send({error: errorMessage});
  }
});

module.exports = router;