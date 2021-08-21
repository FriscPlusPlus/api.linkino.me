/* eslint-disable func-names */
const requestIp = require('request-ip');
const monk = require('monk');
const { clips } = require('../db');

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
      no: 'problem',
    }))
    .catch(() => res.status(200).json({
      yes: 'problem',
    }));
};

const getAllClips = async function (req, res) {
  try {
    const aClips = await clips.find();
    const aData = [];
    aClips.forEach((clip) => {
      aData.push({
        id: clip._id.toHexString(),
        email: clip.c_email,
        clipLink: clip.c_clip,
        name: clip.name,
        userLink: clip.link,
        isApproved: clip.approved,
        totalCounts: clip.total_counts,
        viewCounts: clip.view_counts
      });
    });
    res.status(200).json({
      clips: aData,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

const approveClip = async function (req, res) {
  const { id } = req.params;
  const objectID = monk.id(id);
  try {
    await clips.update({ _id: objectID }, {
      $set: {
        approved: true,
      }
    });
    res.status(201).json({
      "message": "Done!"
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};

module.exports = {
  removeUnusedClips,
  getClip,
  getAllClips,
  approveClip,
};
