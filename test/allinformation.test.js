const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { AllInformation, sequelize } = require('../models');

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

  // Teste para listar todas as informações
  it('Deve listar todas as informações', async () => {
    const mockAllInformations = [
      { id: 1, fk_suco: 1, fk_diagnostico: 1, fk_ingredientes: [1, 2] },
      { id: 2, fk_suco: 2, fk_diagnostico: 2, fk_ingredientes: [2, 3] },
    ];

    // Mock da função findAll do modelo AllInformations
    AllInformation.findAll.mockResolvedValue(mockAllInformations);

    // Chama a rota de listar todas as informações
    request(app)
      .get('/allinformation/all')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.length).toBe(2);
        expect(res.body[0].id).toBe(1);
        expect(res.body[1].id).toBe(2);
        done();
      });
  });

  // Teste para atualizar informações
  it('Deve atualizar informações', async () => {
    const idAllInformation = 1;
    const informacaoAtualizada = {
      fk_suco: 2,
      fk_diagnostico: 2,
      fk_ingredientes: [2, 3],
    };

    // Mock da função findByPk e save do modelo AllInformations
    AllInformations.findByPk.mockResolvedValue(informacaoAtualizada);
    AllInformations.save.mockResolvedValue({ ...informacaoAtualizada, id: idAllInformation });

    // Chama a rota de atualizar informações
    request(app)
      .put(`/allinformation/update/${idAllInformation}`)
      .send(informacaoAtualizada)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Informações atualizadas com sucesso');
        done();
      });
  });
});