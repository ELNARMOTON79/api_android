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
        
        const client = await pool.connect();
            const insertUser = `
            INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const userResult = await client.query(insertUser, [nombre, apellido, correo, contrasena, id_rol]);
        const userId = userResult.rows[0].id;

        const insertNfc = `
            INSERT INTO nfc (id_usuario, token)
            VALUES ($1, encode(gen_random_bytes(16), 'hex'))
            RETURNING token;
        `;
        const nfcResult = await client.query(insertNfc, [userId]);

        console.log('Usuario creado:', userResult.rows[0]);
        res.status(201).json(userResult.rows[0]);
        console.log('NFC creado:', nfcResult.rows[0]);
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
