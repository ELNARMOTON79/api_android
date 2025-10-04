// routes/registro.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, correo, contrasena } = req.body;
        const id_rol = 2; // Rol por defecto (cliente)
        
        console.log('Datos recibidos:', { nombre, apellido, correo, contrasena });

        const query = `
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
            WITH nuevo_usuario AS (
                INSERT INTO public.usuarios (nombre, apellido, correo, contrasena, id_rol)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, nombre, apellido, correo
            )
            INSERT INTO public.nfc (id_usuario, token)
            SELECT id, encode(gen_random_bytes(16), 'hex')
            FROM nuevo_usuario
            RETURNING id_usuario, token;
        `;

        const { rows } = await pool.query(query, [nombre, apellido, correo, contrasena, id_rol]);

        console.log('Usuario y token creados:', rows[0]);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: {
                id_usuario: rows[0].id_usuario,
                nombre,
                apellido,
                correo,
            },
            token: rows[0].token
        });

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