const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Album = require('./Album'); // Importado correctamente

const Imagen = sequelize.define('imagenes', {
  ruta: DataTypes.STRING,
  caption: DataTypes.TEXT,
  publico: { type: DataTypes.BOOLEAN, defaultValue: false }
});

Imagen.belongsTo(Album, { foreignKey: 'album_id' });

module.exports = Imagen;
