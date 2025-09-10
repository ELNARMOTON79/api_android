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

// PUT /usuarios/:id
//Modificar informacion del usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, contraseña } = req.body;
    const { rows } = await pool.query(
      'UPDATE usuarios SET nombre = $1, apellido = $2, correo = $3, contraseña = $4 WHERE id = $5 RETURNING id, nombre, apellido, correo',
      [nombre, apellido, correo, contraseña, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar' });
  }
}); 
module.exports = router;
