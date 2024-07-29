require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const configurePassport = require('./middlewares/passportConfig.js');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Configuração do multer para uploads de arquivos
const multer = require('multer');
const upload = multer({ dest: 'uploads/imgsSucos/' });

// Configuração do Passport
configurePassport(passport);

// Importações dos controladores
const usuario = require('./controllers/usuarioController.js');
const sucos = require('./controllers/sucoController.js');
const ingredientes = require('./controllers/ingredienteControler.js');
const diagnostico = require('./controllers/diagnosticoController.js');
const sucodiagnostico = require('./controllers/sucoDiagnosticoController.js');
const allinformation = require('./controllers/allInformationController.js');

// Configurações do app
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());

// Rotas
app.get('/', (req, res) => res.send('HELLO WORLD, ROTAS OK'));

// Servir arquivos estáticos
app.use('/img', express.static(path.join(__dirname, 'uploads/imgsSucos')));

// Usar controladores
app.use('/usuario', usuario);
app.use('/suco', sucos); // Supondo que `sucoController.js` é onde você usa o multer
app.use('/ingredientes', ingredientes);
app.use('/diagnostico', diagnostico);
app.use('/sucodiagnosticos', sucodiagnostico);
app.use('/allinformation', allinformation);

// Iniciar o servidor
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}!`);
});

module.exports = server;
