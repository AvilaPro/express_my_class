const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/express';

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('Conectado a MongoDB');
})
.catch(err => {
  console.error('Error al conectar a MongoDB:', err.message);
});

// Modelo de ejemplo
const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Ruta para crear un usuario
app.post('/usuarios', async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  try {
    const nuevoUsuario = new Usuario({ nombre, email, contraseña });
    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario creado', usuario: nuevoUsuario });
  } catch (err) {
    console.error('Error al crear el usuario:', err.message);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Ruta para obtener usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
