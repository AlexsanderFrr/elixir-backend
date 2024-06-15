// __tests__/diagnostico.test.js
const request = require('supertest');
const express = require('express');
//const Diagnostico = require('../../models').Diagnostico;
const diagnosticoRouter = require('../diagnosticoController');

// Mock do modelo Diagnostico
jest.mock('../diagnosticoController', () => {
  return {
    Diagnostico: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    }
  };
});

const app = express();
app.use(express.json());
app.use('/diagnosticos', diagnosticoRouter);

describe('Diagnostico API', () => {
  it('Deve cadastrar um novo diagnostico', async () => {
    Diagnostico.create.mockResolvedValue({ nome_da_condicao: 'Condicao Teste', descricao: 'Descricao Teste' });

    const res = await request(app)
      .post('/diagnostico/add')
      .send({ nome_da_condicao: 'Condicao Teste', descricao: 'Descricao Teste' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Diagnostico cadastrado com sucesso!');
  });

  it('Deve buscar todos os diagnosticos', async () => {
    Diagnostico.findAll.mockResolvedValue([{ id: 1, nome_da_condicao: 'Condicao Teste', descricao: 'Descricao Teste' }]);

    const res = await request(app).get('/diagnostico/all');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{ id: 1, nome_da_condicao: 'Condicao Teste', descricao: 'Descricao Teste' }]);
  });

  it('Deve buscar um diagnostico por id', async () => {
    Diagnostico.findByPk.mockResolvedValue({ id: 1, nome_da_condicao: 'Condicao Teste', descricao: 'Descricao Teste' });

    const res = await request(app).get('/diagnostico/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ id: 1, nome_da_condicao: 'Condicao Teste', descricao: 'Descricao Teste' });
  });

  it('Deve atualizar um diagnostico por id', async () => {
    Diagnostico.update.mockResolvedValue([1]);

    const res = await request(app)
      .put('/diagnostico/1')
      .send({ nome_da_condicao: 'Condicao Atualizada', descricao: 'Descricao Atualizada' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Diagnostico atualizado com sucesso');
  });

  it('Deve deletar um diagnostico por id', async () => {
    Diagnostico.destroy.mockResolvedValue(1);

    const res = await request(app).delete('/diagnostico/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Diagnostico excluido com suceso!');
  });

  it('Deve retornar erro ao tentar cadastrar um diagnostico com dados faltando', async () => {
    Diagnostico.create.mockRejectedValue(new Error('Dados faltando'));

    const res = await request(app)
      .post('/diagnostico/add')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Dados faltando');
  });

  it('Deve retornar erro ao tentar buscar diagnostico com id inexistente', async () => {
    Diagnostico.findByPk.mockResolvedValue(null);

    const res = await request(app).get('/diagnostico/999');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('Deve retornar erro ao tentar atualizar um diagnostico com id inexistente', async () => {
    Diagnostico.update.mockResolvedValue([0]);

    const res = await request(app)
      .put('/diagnostico/999')
      .send({ nome_da_condicao: 'Condicao Atualizada', descricao: 'Descricao Atualizada' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('Deve retornar erro ao tentar deletar um diagnostico com id inexistente', async () => {
    Diagnostico.destroy.mockResolvedValue(0);

    const res = await request(app).delete('/diagnostico/999');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});
