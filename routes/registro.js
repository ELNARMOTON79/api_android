// routes/registro.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const crypto = require('crypto'); // añadido

router.post('/', async (req, res) => {
    const client = await pool.connect(); // Obtener conexión individual
    try {
        const { nombre, apellido, correo, contrasena } = req.body;
        const id_rol = 2; // Rol por defecto

        // 🌀 Iniciamos la transacción
        await client.query('BEGIN');

        // 1️⃣ Insertar el nuevo usuario (devolver todos los campos para detectar nombre de columna de id)
        const userResult = await client.query(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, apellido, correo, contrasena, id_rol]
        );

        const newUser = userResult.rows[0];
        console.log('Usuario creado:', newUser);

        // Determinar el id del usuario probando nombres comunes
        const userId = newUser.id ?? newUser.id_usuario ?? newUser.usuario_id;
        if (!userId) {
            throw new Error('No se obtuvo el id del usuario tras la inserción. Revisar esquema de la tabla usuarios.');
        }

        // 2️⃣ Generar token NFC en Node y usar el id correcto
        const token = crypto.randomBytes(16).toString('hex');

        const nfcResult = await client.query(
            `INSERT INTO nfc (id_usuario, token)
             VALUES ($1, $2)
             RETURNING id, token`,
            [userId, token]
        );

        const newNfc = nfcResult.rows[0];
        console.log('Token NFC generado:', newNfc);

        // ✅ Confirmar los cambios
        await client.query('COMMIT');

        // 3️⃣ Responder con ambos resultados
        res.status(201).json({
            usuario: newUser,
            nfc: newNfc
        });

    } catch (err) {
        await client.query('ROLLBACK'); // ❌ Revertir si algo falla
        console.error('Error completo:', err);
        console.error('Código de error:', err.code);
        console.error('Mensaje:', err.message);

        if (err.code === '23505') {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: `Error específico: ${err.message}` });
    } finally {
        client.release(); // 🔒 Liberar conexión
    }
});

module.exports = router;
