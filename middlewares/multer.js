const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// Filtro de archivos permitidos
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|jiff/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: solo se permiten imágenes'));
};

// Exportar el middleware de multer ya configurado
const upload = multer({ storage, fileFilter });

module.exports = upload;
