const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const usuarioRouter = require('../controllers/usuarioController');
const { Usuario } = require('../models');

jest.mock('../models');

const app = express();
app.use(bodyParser.json());
app.use('/usuario', usuarioRouter);

describe('Testes para o Controlador de Usuarios', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../controllers/usuarioController')];
    jest.clearAllMocks();
  });

  it('Deve cadastrar um novo usuário', async () => {
    const novoUsuario = {
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: 'senha123'
    };

    const mockUsuario = { id: 1, ...novoUsuario };

    Usuario.create.mockResolvedValue(mockUsuario);

    const response = await request(app)
      .post('/usuario/add')
      .send(novoUsuario)
      .expect(200);

    expect(response.body.message).toBe('Usuario Cadastrado com sucesso');
    //expect(response.body.Usuario).toEqual(mockUsuario);
  });
 });