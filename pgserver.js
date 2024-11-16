const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',        // Usuario de la base de datos
  host: process.env.PG_HOST || 'localhost',      // Host de la base de datos
  database: process.env.PG_DATABASE || 'express', // Nombre de la base de datos
  password: process.env.PG_PASSWORD || '1234',   // Contraseña del usuario
  port: process.env.PG_PORT || 5433              // Puerto de conexión (por defecto es 5432)
});

// Verificar la conexión a la base de datos
pool.connect()
  .then(client => {
    console.log('Conectado a PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('Error al conectar a PostgreSQL:', err.message);
  });

// Ruta para crear un usuario
app.post('/usuarios', async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, contraseña) VALUES ($1, $2, $3) RETURNING *',
      [nombre, email, contraseña]
    );
    res.status(201).json({ message: 'Usuario creado', usuario: result.rows[0] });
  } catch (err) {
    console.error('Error al crear el usuario:', err.message);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Ruta para obtener usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
