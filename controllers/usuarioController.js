
const Usuario = require('../models/Usuario');

exports.registrar = async (req, res) => {
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
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ where: { email } });
    if (!user || user.password !== password) return res.status(401).json('Credenciales incorrectas');

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json('Error en el servidor');
  }
};

exports.getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener datos del usuario');
  }
};

exports.getTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener usuarios');
  }
};

exports.editarPerfil = async (req, res) => {
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
};

exports.cambiarContrasena = async (req, res) => {
  try {
    const { usuarioId, password } = req.body;
    await Usuario.update({ password }, { where: { id: usuarioId } });
    res.send('Contraseña actualizada');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar contraseña');
  }
};
