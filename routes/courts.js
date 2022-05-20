const express = require('express');
const router = express.Router();
const Courts = require('../middlewares/court.middleware')

router.post('/create', Courts.createCourt, function(req, res, next) {
  res.sendStatus(200);
});

router.post('/delete', Courts.deleteCourt, function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
