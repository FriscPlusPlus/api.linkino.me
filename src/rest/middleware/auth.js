/* eslint-disable func-names */
const Encrypt = require('./encrypt');

const jwt = new Encrypt(process.env.tokenSecret);

const createToken = function (user, isAdmin) {
  const userPayload = {};
  userPayload.user = user;
  userPayload.isAdmin = isAdmin;
  userPayload.expire = new Date() + 3 * 24 * 60 * 60 * 1000;
  const token = jwt.encrypt(JSON.stringify(userPayload));
  return token;
};

const isLoggedIn = function (req, res, next) {
  const token = req.headers.jelassitoken;
  const payload = jwt.decrypt(token);
  try {
    const userData = JSON.parse(payload);
    if (userData.user) {
      next();
    }
  } catch (error) {
    res.status(403).json({
      message: 'not logged in!'
    });
  }
};

module.exports = {
  createToken,
  isLoggedIn
};
