const express = require('express');
const router = express.Router();
const Users = require('../middlewares/users.middleware')

/* POST users listing. */
router.post('/', Users.loadUser, function(req, res, next) {
  res.sendStatus(200);
});

router.post('/create', Users.createUser, function(req, res, next) {
  res.sendStatus(200);
});

router.post('/update', Users.updateUser, function(req, res, next) {
  res.redirect('/administration');
});

router.post('/delete', function(req, res, next) {
  res.sendStatus(200);
});

router.get('/logout', Users.loadUser, function(req, res, next) {
  req.session.user = undefined;
  res.sendStatus(200);
});

module.exports = router;
