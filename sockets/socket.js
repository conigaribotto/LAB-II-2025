// =======================
//  DEPENDENCIAS
// =======================
const sequelize = require('../config/db');

// =======================
//  MAPA DE USUARIOS CONECTADOS
// =======================
const usuariosConectados = new Map();

// =======================
// FUNCIÓN PRINCIPAL PARA CONFIGURAR SOCKET.IO
// =======================
function configurarSockets(io) {
  io.on('connection', socket => {
    console.log('🟢 Usuario conectado');

    // Registrar usuario al conectarse
    socket.on('registrar-usuario', userId => {
      usuariosConectados.set(userId, socket.id);
      console.log(`✅ Usuario ${userId} registrado con socket ${socket.id}`);
    });

    // Manejar envío de solicitud de amistad
    socket.on('enviar-solicitud', async ({ de_usuario_id, para_usuario_id, de_usuario_nombre }) => {
      const socketDestino = usuariosConectados.get(String(para_usuario_id));

      if (socketDestino) {
        const [result] = await sequelize.query(
          `SELECT id FROM amistades WHERE de_usuario_id = ? AND para_usuario_id = ? ORDER BY id DESC LIMIT 1`,
          { replacements: [de_usuario_id, para_usuario_id] }
        );

        const solicitudId = result[0]?.id;

        io.to(socketDestino).emit('nueva-solicitud', {
          id: solicitudId,
          de_usuario_id,
          para_usuario_id,
          de_usuario_nombre
        });

        console.log(`📨 Solicitud enviada de ${de_usuario_id} a ${para_usuario_id}`);
      }
    });

    // Limpiar usuario desconectado
    socket.on('disconnect', () => {
      for (const [userId, socketId] of usuariosConectados.entries()) {
        if (socketId === socket.id) {
          usuariosConectados.delete(userId);
          console.log(`🔴 Usuario ${userId} desconectado`);
          break;
        }
      }
    });
  });
}

// =======================
// 📤 EXPORTAR FUNCIÓN
// =======================
module.exports = configurarSockets;
