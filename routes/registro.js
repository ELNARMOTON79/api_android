// routes/registro.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, correo, contrasena } = req.body;
        const id_rol = 2; // Rol por defecto
        
        // Log para debugging
        console.log('Datos recibidos:', { nombre, apellido, correo, contrasena });
        
        const { rows } = await pool.query(
            `
            WITH nuevo_usuario AS (
                INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, nombre, apellido, correo
            ),
            nueva_nfc AS (
                INSERT INTO nfc (id_usuario, token)
                SELECT id, encode(gen_random_bytes(16), 'hex')
                FROM nuevo_usuario
            )
            SELECT id, nombre, apellido, correo FROM nuevo_usuario
            `,
            [nombre, apellido, correo, contrasena, id_rol]
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
