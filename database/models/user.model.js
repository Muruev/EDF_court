const mongoose = require('mongoose');
/* Модель пользователя */
const UserSchema = new mongoose.Schema({
    name: { type: String }, // ФИО
    username: { type: String }, // Логин
    password: { type: String }, // Пароль
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // Роль
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' }, // Суд
});

module.exports = mongoose.model('User', UserSchema);