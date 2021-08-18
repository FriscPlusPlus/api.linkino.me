const express = require('express');

const { auth } = require('express-openid-connect');

const routers = require('./routers');

const router = express.Router();

const config = {
  authRequired: process.env.authRequired,
  auth0Logout: process.env.auth0Logout,
  secret: process.env.secret,
  baseURL: (process.env.isDev ? 'http://localhost:5000/' : process.env.baseURL),
  clientID: process.env.clientID,
  issuerBaseURL: process.env.issuerBaseURL,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
router.use(auth(config));

router.use(routers);

module.exports = router;
