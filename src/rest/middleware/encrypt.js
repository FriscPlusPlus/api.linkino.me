const crypto = require('crypto');

module.exports = class Encrypt {
  constructor(secret) {
    this.secret = secret;
  }

  encrypt(payload) {
    const cipher = crypto.createCipher('aes-256-ctr', this.secret);
    let token = cipher.update(payload, 'utf8', 'base64');
    token += cipher.final('base64');
    return token;
  }

  decrypt(token) {
    const decipher = crypto.createDecipher('aes-256-ctr', this.secret);
    const decrypted = decipher.update(token, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
  }
};
