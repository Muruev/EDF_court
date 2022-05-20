const Role = require('../database/models/role.model')
const User = require('../database/models/user.model')
const Relation = require('../database/models/relation.model')

async function createRole(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401);
    if(!req.session.user.role.admin) return res.sendStatus(401);
    await Role.create(req.body);
    next();
}

async function deleteRole(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401);
    if(!req.session.user.role.admin) return res.sendStatus(401);
    await User.updateMany({role: req.body.role}, {role: null})
    await Relation.deleteMany({root: req.body.role})
    await Role.findByIdAndDelete(req.body.role)
    next();
}

async function loadRoles(req, res, next) {
    if(req.data === undefined) req.data = {};
    req.data.roles = await Role.find();
    next();
}

module.exports = {
    createRole: createRole,
    loadRoles: loadRoles,
    deleteRole: deleteRole,
}