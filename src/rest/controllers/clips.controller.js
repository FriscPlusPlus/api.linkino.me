/* eslint-disable func-names */
const requestIp = require("request-ip");
const { clips } = require("../db");

const getClip = async function (req, res) {
  const aClips = await clips.find({
    view_counts: { $ne: 0 },
    approved: { $ne: false },
  });
  const ip = requestIp.getClientIp(req);
  const selectedClip = aClips[Math.floor(Math.random() * aClips.length)];
  const sID = selectedClip._id;
  const isIP = selectedClip.ips.find((element) => element === ip);
  let oUpdateData;
  if (!isIP) {
    oUpdateData = {
      $set: {
        view_counts: selectedClip.view_counts - 1,
        total_counts: selectedClip.total_counts + 1,
      },
      $push: { ips: ip },
    };
  } else {
    oUpdateData = {
      $set: {
        total_counts: selectedClip.total_counts + 1,
      },
    };
  }
  await clips.update({ _id: sID }, oUpdateData);
  const data = await clips.find(
    { _id: selectedClip._id },
    { fields: { _id: 0 } }
  );
  await res.json(data);
};

const removeUnusedClips = function (req, res) {
  clips
    .remove({ view_counts: 0 }, { multi: true })
    .then(() => res.status(200).json({
      no: 'problem'
    }))
    .catch(() => res.status(200).json({
      yes: 'problem'
    }));
};

module.exports = {
  removeUnusedClips,
  getClip,
};
