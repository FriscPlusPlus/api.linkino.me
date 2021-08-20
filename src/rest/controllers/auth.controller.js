/* eslint-disable func-names */

const crypto = require('crypto');
const { auth } = require('../db');
const { createToken } = require('../middleware/auth');

const login = async function (req, res) {
  const { username } = req.body;
  if (!username || !req.body.password) {
    return res.status(500).json({
      message: 'Username or password is missing!',
    });
  }
  const password = crypto
    .update(req.body.password)
    .digest('hex');
  try {
    const user = await auth.findOne({
      username,
      password,
    });
    const token = createToken(user.username, user.admin);
    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status('401').json({
      login: 'Error',
    });
  }
};

module.exports = {
  login,
};
