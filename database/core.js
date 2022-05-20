const mongoose = require('mongoose');
const MongoConfig = require('./config');

let _db;

function connect(url) { // Функция подключение к БД
    return mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
}

module.exports = {
    connect: async () => {
        await connect(MongoConfig.uri); // Установка соединение с БД
        _db = mongoose.connection; // Возвращаем объект соединение БД.
        return _db;
    },
    db: () => {
        return _db;
    }
};