const sequelize = require('../config/db');

// Enviar solicitud de amistad
exports.enviarSolicitud = async (req, res) => {
  try {
    const { de_usuario_id, para_usuario_id, de_usuario_nombre } = req.body;

    await sequelize.query(
      `INSERT INTO amistades (de_usuario_id, para_usuario_id, estado) VALUES (?, ?, 'pendiente')`,
      { replacements: [de_usuario_id, para_usuario_id] }
    );

    res.status(201).send('Solicitud enviada');
  } catch (error) {
    console.error('❌ Error al enviar solicitud:', error);
    res.status(500).send('Error al enviar solicitud');
  }
};

// Responder (aceptar/rechazar) una solicitud
exports.responderSolicitud = async (req, res) => {
  try {
    const { id, estado } = req.body;

    await sequelize.query(`UPDATE amistades SET estado = ? WHERE id = ?`, {
      replacements: [estado, id]
    });

    res.send(`Solicitud ${estado}`);
  } catch (error) {
    console.error('❌ Error al responder solicitud:', error);
    res.status(500).send('Error al responder solicitud');
  }
};

// Obtener solicitudes pendientes
exports.obtenerPendientes = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    const [solicitudes] = await sequelize.query(
      `SELECT a.id, a.de_usuario_id, u.nombre AS de_usuario_nombre
       FROM amistades a
       JOIN usuarios u ON a.de_usuario_id = u.id
       WHERE a.para_usuario_id = ? AND a.estado = 'pendiente'`,
      { replacements: [usuarioId] }
    );

    res.json(solicitudes);
  } catch (error) {
    console.error('❌ Error al obtener solicitudes pendientes:', error);
    res.status(500).send('Error al obtener solicitudes pendientes');
  }
};

// Obtener amigos aceptados
exports.obtenerAmigos = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id);

    const [amigos] = await sequelize.query(
      `SELECT u.id, u.nombre, u.email
       FROM amistades a
       JOIN usuarios u ON 
         (a.de_usuario_id = u.id AND a.para_usuario_id = ?)
         OR (a.para_usuario_id = u.id AND a.de_usuario_id = ?)
       WHERE a.estado = 'aceptada' AND (a.de_usuario_id = ? OR a.para_usuario_id = ?)`,
      {
        replacements: [usuarioId, usuarioId, usuarioId, usuarioId]
      }
    );

    res.json(amigos);
  } catch (error) {
    console.error('❌ Error al obtener amigos:', error);
    res.status(500).send('Error al obtener amigos');
  }
};
