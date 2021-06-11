const express = require('express');

const routers = require('./routers');

const router = express.Router();

router.use(routers);

module.exports = router;
