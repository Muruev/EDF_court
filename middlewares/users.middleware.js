const User = require('../database/models/user.model');

async function loadUser(req, res, next) {
    let user = await User.findOne(req.body).populate('role').populate({
            path: 'court',
            populate: {
                path: 'relations',
                populate: [{ path: 'root' }, { path: 'connected' }]
            }
        }
    );
    if(user == null) return res.sendStatus(401);
    req.session.user = user;
    next();
}

async function loadUsers(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401);
    let users = await User.find().populate('role').populate('court');
    if(req.data === undefined) req.data = {};
    req.data.users = users;
    next();
}

async function createUser(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401);
    if(!req.session.user.role.admin) return res.sendStatus(401);
    req.data = await User.create(req.body);
    next();
}

async function updateUser(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401);
    if(!req.session.user.role.admin) return res.sendStatus(401);
    let id = req.body._id; delete req.body._id;
    await User.findByIdAndUpdate(id, req.body)
    next();
}

module.exports = {
    loadUser: loadUser,
    loadUsers: loadUsers,
    createUser: createUser,
    updateUser: updateUser,
}