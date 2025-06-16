const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

const Album = sequelize.define('albumes', {
  titulo: DataTypes.STRING
});

Album.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Album;
