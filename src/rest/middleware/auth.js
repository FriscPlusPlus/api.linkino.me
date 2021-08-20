/* eslint-disable consistent-return */
/* eslint-disable func-names */
const Encrypt = require('./encrypt');

const jwt = new Encrypt(process.env.tokenSecret);

const createToken = function (user, isAdmin) {
  const userPayload = {};
  userPayload.user = user;
  userPayload.isAdmin = isAdmin;
  userPayload.expire = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
  const token = jwt.encrypt(JSON.stringify(userPayload));
  return token;
};

const isLoggedIn = function (req, res, next) {
  const { jelassitoken } = req.headers;
  const payload = jwt.decrypt(jelassitoken);
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

const isExpired = function (req, res, next) {
  const { jelassitoken } = req.headers;
  const payload = jwt.decrypt(jelassitoken);
  const oPayload = JSON.parse(payload);
  const currentDate = new Date().getTime();
  const tokenDate = new Date(oPayload.expire).getTime();
  if ((tokenDate - currentDate) < 0) {
    return res.status(401).json({
      message: 'Token expired!'
    });
  }
  next();
};

module.exports = {
  createToken,
  isLoggedIn,
  isExpired
};
