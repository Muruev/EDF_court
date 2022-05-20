const mongoose = require('mongoose'); // Подключаем библеотку для управление БД

/* Модель суда */
const CourtSchema = new mongoose.Schema({
    name: { type: String }, // Наименование
    relations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Relation' }] // Связи ЭДО
});

module.exports = mongoose.model('Court', CourtSchema);