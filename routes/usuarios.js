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

// POST /usuarios
router.post('/', async (req, res) => {
  const { nombre, apellido, correo } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, correo, contraseña) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, correo',
      [nombre, apellido, correo, contraseña]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});
module.exports = router;
