const express = require('express');
const router = express.Router();
const Role = require('../middlewares/roles.middleware');

router.post('/create', Role.createRole, function(req, res, next) {
    res.sendStatus(200);
});

router.post('/delete', Role.deleteRole, function(req, res, next) {
    res.sendStatus(200);
});

module.exports = router;
