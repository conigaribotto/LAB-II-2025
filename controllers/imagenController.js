// controllers/imagenController.js
const path = require('path');
const Album = require('../models/Album');
const Imagen = require('../models/Imagen');
const Usuario = require('../models/Usuario');

// Publicar una nueva imagen
exports.subirImagen = async (req, res) => {
  try {
    const { caption, albumTitle, usuarioId } = req.body;

    if (!req.file) return res.status(400).json({ message: 'No se subió ninguna imagen' });

    const imagePath = '/uploads/' + req.file.filename;
    let albumId = null;

    if (albumTitle && albumTitle.trim() !== '') {
      const [album] = await Album.findOrCreate({
        where: { titulo: albumTitle, usuario_id: usuarioId },
        defaults: { titulo: albumTitle, usuario_id: usuarioId }
      });
      albumId = album.id;
    }

    const imagen = await Imagen.create({
      album_id: albumId,
      usuario_id: usuarioId,
      ruta: imagePath,
      caption,
      publico: false
    });

    res.status(201).json({ message: 'Imagen compartida correctamente', imagen });
  } catch (error) {
    console.error('❌ Error en subirImagen:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
};

// Obtener imágenes (todas o por usuario)
exports.obtenerImagenes = async (req, res) => {
  try {
    const { usuarioId } = req.query;
    const where = usuarioId ? { usuario_id: usuarioId } : {};
    const imagenes = await Imagen.findAll({ where });
    res.json(imagenes);
  } catch (error) {
    console.error('❌ Error en obtenerImagenes:', error);
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
};
