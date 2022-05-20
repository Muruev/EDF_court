const mongoose = require('mongoose'); // Подключаем библеотку для управление БД
/* Модель документа */
const DocumentSchema = new mongoose.Schema({
    name: { type: String }, // Наименование
    path: { type: String }, // Путь к файлу
    comment: { type: String }, // Комментарии
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Отправитель
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' }, // Суд
    recipients: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ] // Получатели
}, { timestamps: { createdAt: 'created_at' } }); // Время создание

module.exports = mongoose.model('Document', DocumentSchema);