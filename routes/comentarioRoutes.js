const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');

// Crear un comentario
router.post('/comment', comentarioController.crearComentario);

// Obtener comentarios por ID de imagen
router.get('/comentarios/:imagenId', comentarioController.obtenerComentarios);

// Eliminar un comentario
router.delete('/comentario/:id', comentarioController.eliminarComentario);

module.exports = router;
