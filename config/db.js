const { Sequelize } = require('sequelize');

// Configuración de Sequelize
const sequelize = new Sequelize('laboratorio2025', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3307,
  logging: false
});

// Probar conexión
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos exitosa');
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err);
  });

module.exports = sequelize;
