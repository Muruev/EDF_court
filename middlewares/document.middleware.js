const Document = require('../database/models/document.model') // Импорт модели документа
const User = require('../database/models/user.model') // Импорт модели пользователя

/* Функция получение всех возможных получаетелй (орентируясь на схему связи суда)*/
async function getRecipients(user) {
    let recipients = [] // Пустой массив получателей
    let relations = user.court.relations // Выбираем все связанные роли с ролью пользователя
        .filter(r => r.root._id === user.role._id)

    let relation = relations.length !== 0 ? relations[0] : {connected: []} // Если не найдены задаем пустой массив

    for(let role of relation.connected) { // Перебираем все связанные роли
        let users = await User.find({court: user.court._id, role: role}).populate('role') // Подтягиваем всех пользователей
        if(users.length !== 0) recipients = recipients.concat(users) // Объединяем всех пользователей
    }

    return recipients // Возвращаем всех получателей
}
/* Функция создании документа */
async function createDocument(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401); // Если пользователь не вошел в систему

    let document = { // Формирование данных документа
        number: req.body.number, // Наименование
        name: req.files[0].originalname, // Наименование
        path: req.files[0].path, // Путь в файлу
        comment: req.body.comment, // Комментарии
        sender: req.session.user._id, // Ссылка на пользователя
        court: req.session.user.court._id, // Ссылка на суд
        recipients: []
    }

    if('recipient' in req.body) {
        document.recipients.push({
            recipient: req.body.recipient,
            state: 'Начато',
            seen: false
        })
    } else {
        for(let id of (await getRecipients(req.session.user)).map(u => u._id)) {
            document.recipients.push({
                recipient: id,
                state: 'Начато',
                seen: false
            })
        }
    }

    await Document.create(document); // Создание документа
    next();
}

/* Функция получение всех документов */
async function loadDocuments(req, res, next) {
    if(req.session.user === undefined) return next();  // Если пользователь не вошел в систему
    if(req.data === undefined) req.data = {}; // Если не создан объект данных для клиенту
    req.data.documents = await Document.find({
        $or: [
            {"recipients.recipient": req.session.user._id},
            {sender: req.session.user._id }
        ]
    }).populate({
        path: 'sender',
        populate: [{path: 'role'}]
    }).populate("recipients.recipient")

    next();
}

/* Функция запроса всех возможных получателей */
async function validRecipients(req, res, next) {
    if(req.session.user === undefined) return next();  // Если пользователь не вошел в систему
    if(req.data === undefined) req.data = {}; // Если не создан объект данных для клиенту

    req.data.valid_recipients = await getRecipients(req.session.user) // Запрос всех получателей
    next();
}

/* Функция удаление документа */
async function deleteDocument(req, res, next) {
    if(req.session.user === undefined) return next();  // Если пользователь не вошел в систему
    if(req.data === undefined) req.data = {}; // Если не создан объект данных для клиенту

    await Document.findByIdAndDelete(req.params.id)
    next();
}

/* Функция обновлении документа */
async function updateDocument(req, res, next) {
    if(req.session.user === undefined) return next();  // Если пользователь не вошел в систему
    if(req.data === undefined) req.data = {}; // Если не создан объект данных для клиенту

    await Document.findByIdAndUpdate(req.params.id, JSON.parse(req.body.data))
    next();
}

/* Экспорт всех функции */
module.exports = {
    createDocument: createDocument,
    updateDocument: updateDocument,
    deleteDocument: deleteDocument,
    loadDocuments: loadDocuments,
    validRecipients: validRecipients
}