const mongoose = require('mongoose'); // Подключаем библеотку для управление БД

/* Модель документа */
const DocumentSchema = new mongoose.Schema({
    number: { type: String }, // Номер
    name: { type: String }, // Наименование
    path: { type: String }, // Путь к файлу
    comment: { type: String }, // Комментарии
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Отправитель
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' }, // Суд
    recipients: [{
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        state: { type: String, default: "Начато"},
        seen: { type: Boolean, default: false}
    }] // Получатели
}, { timestamps: { createdAt: 'created_at' } }); // Время создание

module.exports = mongoose.model('Document', DocumentSchema);