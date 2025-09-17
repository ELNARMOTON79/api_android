// routes/usuarios.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta para agregar un usuario
router.post('/', async (req, res) => {
    const { nombre, apellido, correo, contrasena, id_rol } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, correo, contrasena, id_rol]
        );
        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

module.exports = router;


