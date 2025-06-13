const express = require('express');
const multer = require('multer');
const path = require('path');
const sequelize = require('./config/db');

const Usuario = require('./models/Usuario');
const Album = require('./models/Album');
const Imagen = require('./models/Imagen');
const Comentario = require('./models/Comentario');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb('Error: solo se permiten imágenes');
  }
});

// HTML
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/perfil.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'perfil.html')));

// Registro
app.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).send('Faltan campos requeridos');

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) return res.status(409).send('El email ya está registrado');

    const user = await Usuario.create({ nombre, email, password });
    res.status(201).json({ message: 'Usuario creado correctamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user || user.password !== password) return res.status(401).json('Credenciales incorrectas');
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json('Error en el servidor');
  }
});

// Editar perfil
app.post('/usuario/editar', upload.single('imagen'), async (req, res) => {
  try {
    const { usuarioId, nombre, email, intereses, antecedentes } = req.body;
    const avatar = req.file ? '/uploads/' + req.file.filename : undefined;

    const data = { nombre, email, intereses, bio: antecedentes };
    if (avatar) data.avatar = avatar;

    await Usuario.update(data, { where: { id: usuarioId } });
    res.send('Perfil actualizado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar perfil');
  }
});

// Cambiar contraseña
app.post('/usuario/pass', async (req, res) => {
  try {
    const { usuarioId, password } = req.body;
    await Usuario.update({ password }, { where: { id: usuarioId } });
    res.send('Contraseña actualizada');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar contraseña');
  }
});

// Obtener usuario por ID
app.get('/usuario/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener datos del usuario');
  }
});

// Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener usuarios');
  }
});

// ✅ CORREGIDO: Subir imagen con usuario_id
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { caption, albumTitle, usuarioId } = req.body;
    const imagePath = '/uploads/' + req.file.filename;

    let album = await Album.findOne({ where: { titulo: albumTitle, usuario_id: usuarioId } });
    if (!album) {
      album = await Album.create({ titulo: albumTitle, usuario_id: usuarioId });
    }

    const imagen = await Imagen.create({
      album_id: album.id,
      usuario_id: usuarioId, // ✅ este campo permite luego filtrar por usuario
      ruta: imagePath,
      caption,
      publico: false
    });

    res.status(201).json({ message: 'Imagen compartida correctamente', imagen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

// Obtener todas las imágenes
app.get('/imagenes', async (req, res) => {
  try {
    const imagenes = await Imagen.findAll();
    res.json(imagenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
});

// Comentarios
app.post('/comment', async (req, res) => {
  try {
    const { texto, imagenId, usuarioId } = req.body;
    const comentario = await Comentario.create({ texto, imagen_id: imagenId, usuario_id: usuarioId });
    res.status(201).json({ message: 'Comentario guardado', comentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar comentario' });
  }
});

// Solicitudes de amistad
app.post('/amistad/enviar', async (req, res) => {
  try {
    const { de_usuario_id, para_usuario_id } = req.body;
    await sequelize.query(
      `INSERT INTO amistades (de_usuario_id, para_usuario_id) VALUES (?, ?)`,
      { replacements: [de_usuario_id, para_usuario_id] }
    );
    res.status(201).send('Solicitud enviada');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al enviar solicitud');
  }
});

// Responder solicitud
app.post('/amistad/responder', async (req, res) => {
  try {
    const { id, estado } = req.body;
    await sequelize.query(
      `UPDATE amistades SET estado = ? WHERE id = ?`,
      { replacements: [estado, id] }
    );
    res.send(`Solicitud ${estado}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al responder solicitud');
  }
});

// Iniciar servidor
sequelize.sync({ alter: true }).then(() => {
  console.log('📦 Base de datos sincronizada');
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
}).catch(err => console.error('❌ Error en sincronización:', err));
