const express = require('express');
const router = express.Router();
const pool = require('../db');

//Listado de servicios
//GET /servicios
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, nombre_servicio, descripcion, precio FROM servicios ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

module.exports = router;