// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usuariosRouter = require('./routes/usuarios');
const citasRouter = require('./routes/citas');
const serviciosRouter = require('./routes/servicios');

const app = express();
app.use(cors({
  // en producción, restringe al origen de tu app: example: origin: 'https://mi-app.web.app'
  origin: true
}));
app.use(express.json());

app.use('/usuarios', usuariosRouter);
app.use('/citas', citasRouter);
app.use('/servicios', serviciosRouter);


app.get('/', (req, res) => res.send('API funcionando'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
