const mongoose = require('mongoose');
/* Модель сообщения */
const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Отправитель
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Получатель
    text: { type: String }, // Текст
}, { timestamps: { createdAt: 'created_at' } }); // Время создание

module.exports = mongoose.model('Message', MessageSchema);