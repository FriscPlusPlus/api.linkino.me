/* eslint-disable func-names */

const crypto = require('crypto');
const { auth } = require('../db');
const { createToken } = require('../middleware/auth');

const login = async function (req, res) {
  const { username } = req.body;
  const password = crypto.createHash('md5').update(req.body.password).digest('hex');
  try {
    const user = await auth.findOne({
      username,
      password,
    });
    const token = createToken(user.username, user.admin);
    res.status(200).json({
      token
    });
  } catch (error) {
    res.status('401').json({
      login: 'Error'
    });
  }
};

module.exports = {
  login
};
