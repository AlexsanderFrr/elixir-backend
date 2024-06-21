const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const diagnosticoRouter = require('../controllers/diagnosticoController');
const Diagnostico = require('../models').Diagnostico; // Importa o modelo Diagnostico

jest.mock('../models'); // Faz o mock do módulo '../models'

const app = express();
app.use(bodyParser.json());
app.use('/diagnostico', diagnosticoRouter);

describe('Testes para o Controlador de Diagnóstico', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../controllers/diagnosticoController')];
    jest.clearAllMocks(); // Limpa todos os mocks antes de cada teste
  });

  it('Deve cadastrar um novo diagnóstico', (done) => {
    const novoDiagnostico = {
      nome_da_condicao: 'Condicao Teste',
      descricao: 'Descricao Teste'
    };

    // Mock da função create do modelo Diagnostico
    Diagnostico.create.mockResolvedValue(novoDiagnostico);

    request(app)
      .post('/diagnostico/add')
      .send(novoDiagnostico)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Diagnostico cadastrado com sucesso!');
        done();
      });
  });

  it('Deve recuperar um diagnóstico', (done) => {
    const idDiagnostico = 1;
    const mockDiagnostico = {
      id: idDiagnostico,
      nome_da_condicao: 'Condicao Teste',
      descricao: 'Descricao Teste'
    };

    // Mock da função findByPk do modelo Diagnostico
    Diagnostico.findByPk.mockResolvedValue(mockDiagnostico);

    request(app)
      .get(`/diagnostico/${idDiagnostico}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.id).toBe(idDiagnostico);
        expect(res.body.nome_da_condicao).toBe(mockDiagnostico.nome_da_condicao);
        expect(res.body.descricao).toBe(mockDiagnostico.descricao);
        done();
      });
  });
});
