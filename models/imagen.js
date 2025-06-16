const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Album = require('./Album');
const Usuario = require('./Usuario');

const Imagen = sequelize.define('imagenes', {
  ruta: DataTypes.STRING,
  caption: DataTypes.TEXT,
  publico: { type: DataTypes.BOOLEAN, defaultValue: false },
  usuario_id: { type: DataTypes.INTEGER },
  album_id: { type: DataTypes.INTEGER }
});

Imagen.belongsTo(Album, { foreignKey: 'album_id' });
Imagen.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Imagen;
