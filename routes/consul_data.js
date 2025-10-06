// routes/usuarios.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    // 1. EXTRAER el token de los Query Parameters (req.query)
    const nfcToken = req.query.token; 

    // Opcional: Validar que el token exista
    if (!nfcToken) {
        // Devuelve un error 400 si el token no se proporciona en la URL
        return res.status(400).json({ error: 'Falta el parámetro "token" en la solicitud.' });
    }

    // La sentencia SQL con el marcador de posición $1
    const sqlQuery = `
        SELECT
            c.id AS id_cita,
            c.fecha,
            c.hora,
            s.nombre_servicio,
            ec.nombre_estado AS estado_cita,
            t.nombre AS nombre_terapeuta,
            t.apellido AS apellido_terapeuta
        FROM
            public.nfc AS n
        JOIN public.usuarios AS u ON n.id_usuario = u.id
        JOIN public.citas AS c ON u.id = c.id_paciente
        JOIN public.estado_cita AS ec ON c.id_estado_cita = ec.id
        JOIN public.servicios AS s ON c.id_servicio = s.id
        JOIN public.usuarios AS t ON c.id_terapeuta = t.id
        WHERE
            n.token = $1; -- Usamos el marcador de posición
    `;

    try {
        // 2. INYECTAR el token en la consulta usando un array
        const { rows } = await pool.query(sqlQuery, [nfcToken]); // <--- ¡AQUÍ ESTÁ LA CLAVE!
        
        // El resultado 'rows' es lo que la Nube de Particle devolverá al Photon.
        // Si no se encuentran citas, 'rows' será un array vacío (ej: []).
        res.json(rows);
    } catch (err) {
        console.error("Error al consultar citas por token NFC:", err);
        res.status(500).json({ error: 'Error interno del servidor al consultar la base de datos.' });
    }
});

module.exports = router;