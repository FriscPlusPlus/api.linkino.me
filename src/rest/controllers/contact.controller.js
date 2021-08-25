/* eslint-disable func-names */
// eslint-disable-next-line no-unused-vars
const { sendEmail } = require('../middleware/email');
const { clips, key } = require('../db/index');

const _createData = function (
  nickname,
  email,
  clip,
  save_auto,
  res,
  link,
  viewCount
) {
  const data = {
    name: nickname,
    c_email: email,
    c_clip: clip,
    approved: save_auto,
    link,
    view_counts: viewCount,
    ips: [],
    total_counts: 0,
  };

  clips
    .insert(data)
    .then(() => res.status(200).json({
      status: 200,
      message: 'done!',
    }))
    .catch(() => res.status(500).json({
      status: 500,
      message: 'Something wrong happened',
    }));
};

const sendClip = function (req, res) {
  // eslint-disable-next-line no-unused-vars
  let save_auto;
  const {
    // eslint-disable-next-line no-unused-vars
    nickname,
    email,
    clip,
    myKey,
    auto,
    link,
  } = req.body;
  // eslint-disable-next-line no-empty
  /* if (myKey) {
    key.find({ key: myKey })
      .then((data) => {
        if (data.isAuto && auto) {
          save_auto = true;
        } else {
          save_auto = false;
        }
        _createData(nickname, email, clip, save_auto, res, link);
      }).catch(() => {
        save_auto = false;
        _createData(nickname, email, clip, save_auto, res, link);
      });
  } else {
    _createData(nickname, email, clip, false, res);
  } */
  _createData(nickname, email, clip, false, res, link, 5);
};

const contact_us = function (req, res) {
  const { email, reason, message } = req.body;
  sendEmail(
    'service@linkino.me',
    `Reason: ${reason} from ${email}`,
    `<b>${message}</b><br><br><a href=mailto:${email}>Contact</a>`,
    (error, info) => {
      if (error) {
        return res.status(500).json({
          code: 500,
          message: 'An error occurred',
        });
      }
      return res.json({
        code: 200,
        message: 'Send!',
      });
    }
  );
};

module.exports = {
  sendClip,
  contact_us,
};
