const express = require('express');
const router = express.Router();

const Courts = require('../middlewares/court.middleware')
const Roles = require('../middlewares/roles.middleware')
const Users = require('../middlewares/users.middleware')
const Documents = require('../middlewares/document.middleware')
const Messages = require('../middlewares/message.middleware')

const multer  = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', Documents.loadDocuments, function(req, res, next) {
  if(req.session.user === undefined) return res.render('pages/sign_in')
  else res.render('pages/index', {user: req.session.user, documents: req.data.documents});
});

router.get('/administration',
    Courts.loadCourts,
    Roles.loadRoles,
    Users.loadUsers,
    function(req, res, next) {

  if(req.session.user === undefined) return res.render('pages/sign_in')
  else res.render('pages/administration', {user: req.session.user, data: req.data});
});

/* Раздел связи */
router.get('/relation',
    Courts.loadCourts,
    Roles.loadRoles,
    function(req, res, next) {

  if(req.session.user === undefined) return res.render('pages/sign_in')
  else res.render('pages/relation', {user: req.session.user, data: req.data});
});

router.post('/relation', Courts.updateCourt, function(req, res, next) {
  res.sendStatus(200)
});

/* Раздел документов */
router.get('/documents', Documents.validRecipients, function(req, res, next) {
  if(req.session.user === undefined) return res.render('pages/sign_in')
  else res.render('pages/documents', {user: req.session.user, data: req.data});
});

router.post('/documents', upload.any(), Documents.createDocument, function(req, res, next) {
  res.send({uploaded: 'OK'})
});

/* Раздел чата */
router.get('/messages', Documents.validRecipients, function(req, res, next) {
  if(req.session.user === undefined) return res.render('pages/sign_in')
  else res.render('pages/messages', {user: req.session.user, data: req.data});
});

router.post('/messages', Messages.createMessage, function(req, res, next) {
  res.sendStatus(200)
});

router.get('/messages/get', Messages.userMessages, function(req, res, next) {
  if(req.session.user === undefined) return res.sendStatus(401)
  res.send(req.data.messages)
});

module.exports = router;
