// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const upload = require('../middlewares/multer'); // 👈 Importa multer desde el middleware

// Rutas de usuario
router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/usuario/:id', usuarioController.getUsuario);
router.get('/usuarios', usuarioController.getTodosUsuarios);
router.post('/usuario/editar', upload.single('imagen'), usuarioController.editarPerfil);
router.post('/usuario/pass', usuarioController.cambiarContrasena);

module.exports = router;
