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

router.post('/signup', async (req, res) => {
  try {
    const {username, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
      );
      const user = result.rows[0];
      const token = jwt.sign({userId: user.id}, secret);
      res.send({message: `User, ${username} Created Successfully!`, user, token});
      console.log(token);
    } catch (error) {
      console.error(error);
      res.status(500).send({error: 'An Error Occurred While Creating The User.'});
    }
});

module.exports = router;