const monk = require('monk');

require('dotenv').config();

const db = monk(process.env.MONGO_DB);
const urls = db.get('urls');
const clips = db.get('ads_clips');
const key = db.get('key');

module.exports = {
  urls,
  clips,
  key
};
