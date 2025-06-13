const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('usuarios', {
  nombre: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  avatar: DataTypes.STRING,
  intereses: DataTypes.TEXT,
  bio: DataTypes.TEXT,
  modo_vitrina: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Usuario;
