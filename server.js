// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usuariosRouter = require('./routes/usuarios');
const loginRouter = require('./routes/login');
const registroRoutes = require('./routes/registro');

const app = express();
app.use(cors({
  // en producción, restringe al origen de tu app: example: origin: 'https://mi-app.web.app'
  origin: true
}));
app.use(express.json());

app.use('/usuarios', usuariosRouter);
app.use('/login', loginRouter);
app.use('/usuarios', registroRoutes);

app.get('/', (req, res) => res.send('API funcionando'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
