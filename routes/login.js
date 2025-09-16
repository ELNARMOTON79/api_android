const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /login
router.get('/', async (req, res) => {
  const { correo, contrasena } = req.query; // Changed from req.body to req.query
  try {
    // It's good practice to check if correo and contrasena exist
    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }
    const { rows } = await pool.query(
      'SELECT id, nombre, apellido, correo, id_rol FROM usuarios WHERE correo = $1 AND contrasena = $2',
      [correo, contrasena]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

module.exports = router;