const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//protocolo de comunicacão entre apis e outros serviços cors
//CORS: autoriza para qualquer tipo de serviço (front-end, outras apis,etc)

const cors = require('cors')
const app = express();
const port = 8081;
//const img = multer(uploadImg);

//importações
const usuario = require('./controllers/usuarioController.js');
const sucos = require('./controllers/sucoController.js')
const ingredientes = require ('./controllers/ingredienteControler.js')
const diagnostico = require('./controllers/diagnosticoController.js')
const sucodiagnostico = require('./controllers/sucoDiagnosticoController.js')
const allinformation = require('./controllers/allInformationController.js')
const uploadImg = require('./controllers/sucoController.js')


//Rotas
app.use(bodyParser.json());
//Função CORS para a autorização do uso da API
app.use(cors())



app.get('/', (req, res) => res.send('HELLO WORLD, ROTAS OK'))


app.use('/img', express.static(path.join(__dirname, 'uploads/imgsSucos')));

app.use('/usuario', usuario);
app.use('/suco', sucos);
app.use('/ingredientes', ingredientes)
app.use('/diagnostico', diagnostico)
app.use('/sucodiagnosticos', sucodiagnostico)
app.use('/allinformation', allinformation);

app.listen(port, () => console.log(`Servidor rodando porta ${port}!`))

