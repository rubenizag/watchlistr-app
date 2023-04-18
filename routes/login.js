const express = require('express');
const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'testing123';
const middlewareRouter = require('../middlewares/router');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


router.use(middlewareRouter);

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body;
    const result = await pool.query(
      'SELECT id, username, password FROM users WHERE username=$1',
      [username]
    );
    if (result.rows.length === 0) {
      res.status(401).send({error: 'Invalid Username'});
      return;
    }
    const user = result.rows[0];
    console.log(user);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).send({error: 'Invalid Password'});
      return;
    }
    req.session.userId = user.id;
    console.log(req.session)
    const token = jwt.sign({userId: user.id}, secret);
    res.send({message: 'Login successful', userId: user.id, username: user.username, token});
    console.log(token);
  } catch (error) {
    console.error(error);
    res.status(500).send({error: 'An Error Occurred While Logging In.'});
  }
});

module.exports = router;