const express = require('express');
const router = express.Router();
const pool = require('../db');
// POST /login
router.post('/', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, apellido, correo, id_rol FROM usuarios WHERE correo = $1 AND contraseña = $2',
      [correo, contraseña]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});
module.exports = router;