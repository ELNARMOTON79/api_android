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

// GET /usuarios/:id
/*router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT id, nombre, apellido, correo FROM usuarios WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// POST /usuarios
router.post('/', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING id, nombre, email, creado_en',
      [nombre, email]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /usuarios/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;
    const { rows } = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3 RETURNING id, nombre, email, creado_en',
      [nombre, email, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// DELETE /usuarios/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});*/

module.exports = router;
