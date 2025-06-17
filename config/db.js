require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Conexión a la base de datos exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = sequelize;


/*const { Sequelize } = require('sequelize');

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
*/