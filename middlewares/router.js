const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const router = express.Router();

router.use(express.json());
router.use(cors());
router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(
  session({
    secret: 'testing123',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}, // Set the "secure" option to true if using HTTPS
  })
);

module.exports = router;