const express = require('express');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const getIp = require('request-ip');

const { isLoggedIn, isExpired } = require('../middleware/auth');

const router = express.Router();
const controllers = require('../controllers');

const createLinkSpeedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,
  delayMs: 100
});

const createLinkRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'To many links where created, try again in 1 Hour'
});

const contactSpeedLimiter = slowDown({
  windowMs: 60 * 60 * 1000,
  delayAfter: 3,
  delayMs: 500
});

const contactRateLimiter = rateLimit({
  windowMs: 18000000,
  max: 5,
  message: 'Something went wrong try again in a few hours'
});

const sendClipSpeedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,
  delayMs: 300
});

const sendClipRateLimiter = rateLimit({
  windowMs: 86400000,
  max: 5,
  message: 'You passed the limit, you can send a max of 5 clips for day!'
});

// test

router.get('/test/ip', (req, res) => {
  res.json({
    ip: getIp.getClientIp(req)
  });
});

router.get('/app/listMyUrl', controllers.links.getLinkByIp);
router.get('/:slug', controllers.links.getLink);
router.delete('/:slug', controllers.links.deleteLinkBySlug);
router.post('/app', createLinkSpeedLimiter, createLinkRateLimiter, controllers.links.createLink);

// route for contacts

router.post('/app/sendClip', sendClipSpeedLimiter, sendClipRateLimiter, controllers.contact.sendClip);
router.post('/app/contactUs', contactSpeedLimiter, contactRateLimiter, controllers.contact.contact_us);

// route for bg clips

router.get('/app/getClips', controllers.clips.getClip);
router.get('/app/removeOldClips', controllers.clips.removeUnusedClips);
router.get('/app/getAllClips', isLoggedIn, isExpired, controllers.clips.getAllClips);
router.post('/app/approveClip/:id', isLoggedIn, isExpired, controllers.clips.approveClip);
router.post('/app/declineClip/:id', isLoggedIn, isExpired, controllers.clips.declineClip);
router.post('/app/deleteClip/:id', isLoggedIn, isExpired, controllers.clips.deleteClip);
router.post('/app/editClip/:id', isLoggedIn, isExpired, controllers.clips.editClip);

// router for auth

router.post('/auth/login', controllers.auth.login);
router.get('/auth/isExpired', isLoggedIn, isExpired, (req, res) => {
  res.status(200).json({
    isExpired: false
  });
});

// route to all

router.get('/', (req, res) => res.status(418).sendFile(`${__dirname}/teapot/index.html`));

module.exports = router;
