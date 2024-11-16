const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Clave secreta para firmar el JWT (debe mantenerse segura)
const SECRET_KEY = process.env.JWT_SECRET || 'tu_secreta_clave';

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Usuarios simulados
const users = [
  { id: 1, username: 'admin', password: '1234' },
  { id: 2, username: 'user', password: 'abcd' }
];

// Ruta de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validación de credenciales
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Creación del token JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username }, // Payload
    SECRET_KEY, // Clave secreta
    { expiresIn: '1h' } // Tiempo de expiración
  );

  // Respuesta con el token
  res.json({ token });
});

// Ruta protegida de ejemplo
app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó un token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: 'Acceso autorizado', data: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
