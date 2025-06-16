const Comentario = require('../models/Comentario');
const Usuario = require('../models/Usuario');

// Crear un comentario nuevo
exports.crearComentario = async (req, res) => {
  try {
    const { texto, imagenId, usuarioId } = req.body;
    const comentario = await Comentario.create({ texto, imagen_id: imagenId, usuario_id: usuarioId });
    res.status(201).json({ message: 'Comentario guardado', comentario });
  } catch (error) {
    console.error('❌ Error al guardar comentario:', error);
    res.status(500).json({ error: 'Error al guardar comentario' });
  }
};

// Obtener comentarios de una imagen
exports.obtenerComentarios = async (req, res) => {
  try {
    const { imagenId } = req.params;
    const comentarios = await Comentario.findAll({
      where: { imagen_id: imagenId },
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(comentarios);
  } catch (error) {
    console.error('❌ Error al obtener comentarios:', error);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

// Eliminar un comentario
exports.eliminarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    await Comentario.destroy({ where: { id } });
    res.send('Comentario eliminado');
  } catch (error) {
    console.error('❌ Error al eliminar comentario:', error);
    res.status(500).send('Error al eliminar comentario');
  }
};
