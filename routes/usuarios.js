// routes/usuarios.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /usuarios
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, nombre, apellido, correo FROM usuarios ORDER BY id');
    console.log(rows); // Mostrar usuarios en la consola
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

//post usuarios para login
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, apellido, correo FROM usuarios WHERE correo = $1 AND contraseña = $2',
      [correo, contraseña]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// POST /usuarios
router.post('/crearusuario', async (req, res) => {
  const { nombre, apellido, correo, contraseña } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, correo, contraseña, id_rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, apellido, correo, id_rol',
      [nombre, apellido, correo, contraseña, id_rol = 2] 
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});
module.exports = router;

