const Message = require('../database/models/message.model'); // Импорт модели сообщения

/* Функция запроса всех сообщении определенного пользователя */
async function userMessages(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401); //
    if(req.data === undefined) req.data = {};
    let query = {};
    if('id' in req.query && req.query.id !== 'undefined') {
        query = {
            $or: [
                {$and: [{sender: req.session.user._id}, {recipient: req.query.id}]},
                {$and: [{sender: req.query.id}, {recipient: req.session.user._id}]}
            ]
        }
    }
    else {
        query = {$or: [{sender: req.session.user._id}, {recipient: req.session.user._id}]}
    }
    req.data.messages = await Message.find(query).populate(['recipient', 'sender'])
    next();
}

async function createMessage(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401);
    await Message.create(JSON.parse(req.body.data))
    next();
}

module.exports = {
    userMessages: userMessages,
    createMessage: createMessage
}