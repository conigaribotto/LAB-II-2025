const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Imagen = require('./imagen');
const Usuario = require('./usuario');

const Comentario = sequelize.define('comentarios', {
  texto: DataTypes.TEXT
});

Comentario.belongsTo(Imagen, { foreignKey: 'imagen_id' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = Comentario;
