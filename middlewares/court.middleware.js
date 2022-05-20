const Court = require('../database/models/court.model') // Импорт модели суда
const Relation = require('../database/models/relation.model') // Импорт модели связи

/* Функция создание суда */
async function createCourt(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401); // Если пользователь не вошел в систему
    if(!req.session.user.role.admin) return res.sendStatus(401); // Если пользователь не явлется администратором
    await Court.create(req.body);
    next();
}

/* Функция удаление суда */
async function deleteCourt(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401); // Если пользователь не вошел в систему
    if(!req.session.user.role.admin) return res.sendStatus(401); // Если пользователь не явлется администратором
    let court = await Court.findById(req.body.court) // Находим нужный нам суд
    let query = {_id: {$in: court.relations}} // Строка запроса всех связей в суде
    await Relation.deleteMany(query) // Удаление всех связей
    await Court.findByIdAndDelete(req.body.court) // Удаление суда
    next();
}

/* Функция подгрузки всех судов */
async function loadCourts(req, res, next) {
    if(req.data === undefined) req.data = {};
    req.data.courts = await Court.find().populate({
        path: 'relations', // Подтягиваем все связи
        populate: [{ path: 'root' }, { path: 'connected' }] // Подтягиваем роли
    })
    next();
}

/* Функция обновлении данные суда */
async function updateCourt(req, res, next) {
    if(req.session.user === undefined) return res.sendStatus(401); // Если пользователь не вошел в систему
    if(!req.session.user.role.admin) return res.sendStatus(401); // Если пользователь не явлется администратором
    let court = await Court.findById(req.query.court); // Находим нужный суд
    if(court.relations.length !== 0) { // Если существуют связи в суде
        let query = {_id: {$in: court.relations}} // Строка запроса всех связей
        await Relation.deleteMany(query) // Удаляем все связи
    }
    let relations = await Relation.create(JSON.parse(req.body.data).relations) // Создаем связи
    await Court.findByIdAndUpdate(req.query.court, {relations: relations.map(r => r._id)}) // Обновляем данные суда
    next();
}

/* Экспортируем все функции */
module.exports = {
    createCourt: createCourt,
    deleteCourt: deleteCourt,
    loadCourts: loadCourts,
    updateCourt: updateCourt
}