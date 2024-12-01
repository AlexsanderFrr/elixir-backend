require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const configurePassport = require('./middlewares/passportConfig.js');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

configurePassport(passport);

const usuario = require('./controllers/usuarioController.js');
const sucos = require('./controllers/sucoController.js');
const ingredientes = require('./controllers/ingredienteControler.js');
const diagnostico = require('./controllers/diagnosticoController.js');
const sucodiagnostico = require('./controllers/sucoDiagnosticoController.js');
const allinformation = require('./controllers/allInformationController.js');
const categoria = require('./controllers/categoriaController.js');

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());

app.get('/', (req, res) => res.send('HELLO WORLD, ROTAS OK'));

app.use('/img', express.static(path.join(__dirname, 'uploads/imgsSucos')));
app.use('/usuario', usuario);
app.use('/suco', sucos);
app.use('/ingredientes', ingredientes);
app.use('/diagnostico', diagnostico);
app.use('/suco_diagnostico', sucodiagnostico);
app.use('/allinformation', allinformation);
app.use('/categoria', categoria);

const server = app.listen(port, () => {
  console.log(`Servidor rodando porta ${port}!`);
});

module.exports = server;