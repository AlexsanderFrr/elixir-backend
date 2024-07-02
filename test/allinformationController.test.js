const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const  AllInformation = require('../models').AllInformation;

jest.mock('../models');

const app = express();
app.use(bodyParser.json());

// Importe o controlador a ser testado (assumindo que seja chamado AllInformationController)
const allInformationRouter = require('../controllers/allInformationController');
app.use('/allinformation', allInformationRouter);

// Limpa o cache do require e limpa todos os mocks antes de cada teste
beforeEach(() => {
  delete require.cache[require.resolve('../controllers/allInformationController')];
  jest.clearAllMocks();
});

// Teste para cadastrar informações
describe('Testes para o Controlador de AllInformations', () => {
  it('Deve cadastrar novas informações', async () => {
    // Mock dos dados a serem usados no teste
    const novoAllInformation = {
      fk_suco: 1,
      fk_diagnostico: 1,
      fk_ingredientes: [1, 2, 3],
    };

    // Mock da função create do modelo AllInformations
    AllInformation.create.mockResolvedValue(novoAllInformation);

    // Chama a rota de adicionar informações
    request(app)
      .post('/allinformation/add')
      .send(novoAllInformation)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Informações Cadastradas com sucesso');
        done();
      });
  });
});