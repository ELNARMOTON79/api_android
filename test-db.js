// test-db.js
require('dotenv').config();
const pool = require('./db');

async function testConnection() {
  try {
    //Insertar usuario de prueba mandando llamar el endpoint de registro /routes/registro.js y insertar en la tabla nfc un token unico al usuario
    //nombre, apellido, correo, contrasena, id_rol
    //Rafael, Perez, rafael.perez@example.com, contrasena123, 2
    const client = await pool.connect();
    const insertUser = `
      INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const userResult = await client.query(insertUser, ['Rafael', 'Perez', 'rafael.perez@example.com', 'contrasena123', 2]);
    const userId = userResult.rows[0].id;

    const insertNfc = `
      INSERT INTO nfc (id_usuario, token)
      VALUES ($1, encode(gen_random_bytes(16), 'hex'))
      RETURNING token;
    `;
    const nfcResult = await client.query(insertNfc, [userId]);

    console.log('Conexión exitosa y usuario de prueba insertado con token NFC:', nfcResult.rows[0]);
    client.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

testConnection();


//como inicar el test?//node test-db.js