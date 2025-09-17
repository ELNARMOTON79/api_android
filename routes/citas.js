const express = require('express');
const router = express.Router();
const pool = require('../db');

//Obtener citas del usuario logeado
//GET /citas
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM citas WHERE usuario_id = $1 ORDER BY id', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

module.exports = router;