const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//protocolo de comunicacão entre apis e outros serviços cors
//CORS: autoriza para qualquer tipo de serviço (front-end, outras apis,etc)

const cors = require('cors')
const app = express();
const port = 8081;
//const uploadImg = require('./controllers/movieController.js')

//importações
//const genres = require('./controllers/genreController.js');
//const sucos = require('./controllers/Controller.js');
const usuario = require('./controllers/usuarioController.js');
//const moviesGenres = require('./controllers/movieGenreController.js');
//const usersRates = require('./controllers/userRateController.js');
//const img = multer(uploadImg);

//Rotas
app.use(bodyParser.json());
//Função CORS para a autorização do uso da API
app.use(cors())



app.get('/', (req, res) => res.send('HELLO WORLD, ROTA OK'))


//app.use('/img', express.static(path.join(__dirname, 'uploads')));

//app.use('/rota-genres', genres);
//app.use('/rota-movies', movies);
app.use('/rota-usuario', usuario);
//app.use('/rota-movies-genres', moviesGenres);
//app.use('/rota-users-rates', usersRates);

app.listen(port, () => console.log(`Servidor rodando porta ${port}!`))