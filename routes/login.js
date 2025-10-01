const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// GET /login
router.get('/', async (req, res) => {
  const { correo, contrasena } = req.query; // Changed from req.body to req.query
  try {
    // It's good practice to check if correo and contrasena exist
    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }
    const { rows } = await pool.query(
      'SELECT id, nombre, apellido, correo, id_rol, contrasena FROM usuarios WHERE correo = $1 AND id_rol = $2',
      [correo, '2']
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    
    const user = rows[0];
    const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Remove password from response
    const { contrasena: _, ...userResponse } = user;
    res.json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

module.exports = router;