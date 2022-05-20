const mongoose = require('mongoose');
/* Модель связи */
const RelationSchema = new mongoose.Schema({
    root: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // Роль
    position: { // Позиция элемента в схеме
        x: {type: Number },
        y: {type: Number }
    },
    connected: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Role' } ] // Роли
});

module.exports = mongoose.model('Relation', RelationSchema);