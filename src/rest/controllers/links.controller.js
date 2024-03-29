/* eslint-disable no-console */
const { nanoid } = require('nanoid');
const requestIp = require('request-ip');

const { urls } = require('../db/index');

urls.createIndex({ slug: 1 }, { unique: true });

// eslint-disable-next-line func-names
const getLinkByIp = function (req, res) {
  const ip = requestIp.getClientIp(req);
  urls.find({ ip }, { fields: { _id: 0, ip: 0 } }).then((doc) => {
    if (doc === null || doc.length === 0) {
      return res.status(404).json({
        message: 'No link was found!',
      });
    }
    return res.json(doc);
  });
};

// eslint-disable-next-line func-names
const getLink = function (req, res, next) {
  const { slug } = req.params;
  try {
    urls.findOne({ slug }).then((doc) => {
      if (doc === null) {
        return res.status(404).json({
          message: 'Link not found',
        });
      }
      return res.json({
        link: doc.link,
      });
    });
  } catch (e) {
    next(e);
  }
};

// eslint-disable-next-line consistent-return,
const createLink = function (req, res, next) {
  const sLink = req.body.link;
  let oData;
  let sSlug;
  if (req.body.slug) {
    sSlug = req.body.slug;
  } else {
    sSlug = nanoid(5);
  }
  if (sSlug.length > 5) {
    return res.status(429).json({
      message: 'The slug is too long! Max length is 5',
    });
  }
  // eslint-disable-next-line prefer-const
  oData = { link: sLink, slug: sSlug, ip: requestIp.getClientIp(req) };
  try {
    urls
      .insert(oData)
      .then(() => res.json({
        slug: oData.slug,
      }))
      .catch(() => res.status(500).json({
        status: '500',
        message: 'Duplicate slug detected!',
      }));
  } catch (e) {
    next(e);
  }
};

const deleteLinkBySlug = function (req, res) {
  const slugID = req.params.slug;
  const userIP = requestIp.getClientIp(req);
  urls.find({ slug: slugID }).then((data) => {
    if (userIP === data[0].ip) {
      urls.remove({ slug: slugID })
        .then(() => res.status(200).json({ message: 'Done!' }))
        .catch(() => res.status(500).json({ message: 'Something went wrong!' })); 
    }
  });
};

module.exports = {
  getLink,
  getLinkByIp,
  deleteLinkBySlug,
  createLink,
};
