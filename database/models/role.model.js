const mongoose = require('mongoose');
/* Модель роли */
const RoleSchema = new mongoose.Schema({
    name: { type: String }, // Наименование
    admin: { type: Boolean, default: false} // Является ли администратором
});

module.exports = mongoose.model('Role', RoleSchema);