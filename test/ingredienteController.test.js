const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ingredienteRouter = require('../controllers/ingredienteControler');
const Ingrediente = require('../models').Ingrediente;

jest.mock('../models');

const app = express();
app.use(bodyParser.json());
app.use('/ingredientes', ingredienteRouter);

describe('Testes para o Controlador de Ingredientes', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../controllers/ingredienteControler')];
    jest.clearAllMocks();
  });

  it('Deve cadastrar um novo ingrediente', async () => {
    const novoIngrediente = {
      nome: 'Tomate',
      beneficios: 'Rico em vitamina C',
    };

    Ingrediente.create.mockResolvedValue(novoIngrediente);

     request(app)
      .post('/ingredientes/add')
      .send(novoIngrediente)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(response.body.message).toBe('Ingrediente Cadastrado com sucesso');
        done();
      });

    
  });
});
