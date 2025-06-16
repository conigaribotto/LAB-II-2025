// routes/imagenRoutes.js
const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');
const upload = require('../middlewares/multer'); // 👈 Importa multer desde el middleware

// Subir imagen
router.post('/upload', upload.single('image'), imagenController.subirImagen);

// Obtener imágenes
router.get('/imagenes', imagenController.obtenerImagenes);

module.exports = router;
