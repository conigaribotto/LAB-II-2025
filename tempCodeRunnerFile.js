// =======================
// DEPENDENCIAS
// =======================
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/db');

// =======================
// CONFIGURACIÓN INICIAL
// =======================
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

// =======================
// SOCKET.IO (CONFIGURACIÓN)
// =======================
const configurarSockets = require('./sockets/socket');
configurarSockets(io); // 👈 Inicializa la lógica de sockets

// =======================
// MIDDLEWARES
// =======================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// =======================
// RUTAS ESTÁTICAS (HTML)
// =======================
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/perfil.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'perfil.html')));

// =======================
// RUTAS DE LA APLICACIÓN
// =======================
const usuarioRoutes = require('./routes/usuarioRoutes');
const imagenRoutes = require('./routes/imagenRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const amistadRoutes = require('./routes/amistadRoutes');

app.use(usuarioRoutes);
app.use(imagenRoutes);
app.use(comentarioRoutes);
app.use(amistadRoutes);

// =======================
// INICIAR SERVIDOR
// =======================
sequelize.sync({ alter: true }).then(() => {
  console.log('📦 Base de datos sincronizada');
  server.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
}).catch(err => console.error('❌ Error en sincronización:', err));
