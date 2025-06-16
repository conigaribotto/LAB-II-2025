const express = require('express');
const router = express.Router();
const amistadController = require('../controllers/amistadController');

// Enviar solicitud
router.post('/amistad/enviar', amistadController.enviarSolicitud);

// Responder solicitud
router.post('/amistad/responder', amistadController.responderSolicitud);

// Obtener solicitudes pendientes
router.get('/amistades/pendientes/:id', amistadController.obtenerPendientes);

// Obtener amigos aceptados
router.get('/amistades/aceptadas/:id', amistadController.obtenerAmigos);

module.exports = router;
