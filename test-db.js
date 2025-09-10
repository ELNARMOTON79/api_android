// test-db.js
require('dotenv').config();
const pool = require('./db');

async function testConnection() {
  try {
    // Ejecutamos consulta a la tabla usuarios
    const { rows } = await pool.query('SELECT * FROM usuarios');

    console.log("✅ Conexión exitosa a PostgreSQL en Render");
    console.log("📋 Usuarios en la tabla:");

    if (rows.length === 0) {
      console.log("⚠️ No hay usuarios en la tabla todavía.");
    } else {
      rows.forEach(user => {
        console.log(`ID: ${user.id} | Nombre: ${user.nombre} | Email: ${user.email}`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error al conectar o consultar la base de datos:", err.message);
    process.exit(1);
  }
}

testConnection();
