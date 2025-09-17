// routes/registro.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, correo, contraseña } = req.body;
        
        // Log para debugging
        console.log('Datos recibidos:', { nombre, apellido, correo, contraseña });
        
        const { rows } = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, correo',
            [nombre, apellido, correo, contraseña]
        );
        
        console.log('Usuario creado:', rows[0]);
        res.status(201).json(rows[0]);
        
    } catch (err) {
        console.error('Error completo:', err);
        console.error('Código de error:', err.code);
        console.error('Mensaje:', err.message);
        
        if (err.code === '23505') {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: `Error específico: ${err.message}` });
    }
});

module.exports = router;
