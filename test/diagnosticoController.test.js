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

  it('Deve listar todos os diagnósticos', (done) => {
    const mockDiagnostico = [
      { id: 1, nome_da_condicao: 'Condicao Teste 1', descricao: 'Descricao Teste 1'},
      { id: 2, nome_da_condicao: 'Condicao Teste 2', descricao: 'Descricao Teste 2'}
    ];

    // Mock da função findAll do modelo Diagnostico
    Diagnostico.findAll.mockResolvedValue(mockDiagnostico);

    request(app)
      .get(`/diagnostico/all`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.length).toBe(2);
        expect(res.body[0].id).toBe(1);
        expect(res.body[0].nome_da_condicao).toBe('Condicao Teste 1');
        expect(res.body[0].descricao).toBe('Descricao Teste 1');
        expect(res.body[1].id).toBe(2);
        expect(res.body[1].nome_da_condicao).toBe('Condicao Teste 2');
        expect(res.body[1].descricao).toBe('Descricao Teste 2');
        done();
      });
  });

  it('Deve alterar um diagnóstico', (done) => {
    const idDiagnostico = 1;
    const diagnosticoAtualizado = {
      nome_da_condicao: 'Condicao Atualizada',
      descricao: 'Descricao Atualizada'
    };

    // Mock da função update do modelo Diagnostico
    Diagnostico.update.mockResolvedValue([1]); // Indica que uma linha foi afetada

    request(app)
      .put(`/diagnostico/${idDiagnostico}`)
      .send(diagnosticoAtualizado)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Diagnostico atualizado com sucesso');
        done();
      });
  });
  it('Deve deletar um diagnóstico', (done) => {
    const idDiagnostico = 1;

    // Mock da função destroy do modelo Diagnostico
    Diagnostico.destroy.mockResolvedValue(1); // Indica que uma linha foi removida

    request(app)
      .delete(`/diagnostico/${idDiagnostico}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Diagnostico excluido com suceso!');
        done();
      });
  });
});