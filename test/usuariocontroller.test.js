const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
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
    //expect(response.body.usuario).toEqual(mockUsuario);
  });

  it('Deve fazer login e retornar um token JWT', async () => {
    const loginUsuario = {
      email: 'teste@teste.com',
      senha: 'senha123'
    };

    const mockUsuario = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: await bcrypt.hash('senha123', 10) // Senha hasheada
    };

    Usuario.findOne.mockResolvedValue(mockUsuario);

    const response = await request(app)
      .post('/usuario/login')
      .send(loginUsuario)
      .expect(200);

    expect(response.body.message).toBe('Autenticado com sucesso');
    expect(response.body.token).toBeDefined();
  });

  it('Deve listar todos os usuários com autenticação', async () => {
    const loginUsuario = {
      email: 'teste@teste.com',
      senha: 'senha123'
    };

    const mockUsuario = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: await bcrypt.hash('senha123', 10) // Senha hasheada
    };

    Usuario.findOne.mockResolvedValue(mockUsuario);

    const loginResponse = await request(app)
      .post('/usuario/login')
      .send(loginUsuario)
      .expect(200);

    const token = loginResponse.body.token;

    const mockUsuarios = [
      { id: 1, nome: 'Teste 1', email: 'teste1@teste.com', senha: 'senha123' },
      { id: 2, nome: 'Teste 2', email: 'teste2@teste.com', senha: 'senha123' }
    ];

    Usuario.findAll.mockResolvedValue(mockUsuarios);

    const response = await request(app)
      .get('/usuario/all')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(mockUsuarios);
  });

  it('Deve buscar um usuário por ID com autenticação', async () => {
    const loginUsuario = {
      email: 'teste@teste.com',
      senha: 'senha123'
    };

    const mockUsuario = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: await bcrypt.hash('senha123', 10) // Senha hasheada
    };

    Usuario.findOne.mockResolvedValue(mockUsuario);

    const loginResponse = await request(app)
      .post('/usuario/login')
      .send(loginUsuario)
      .expect(200);

    const token = loginResponse.body.token;

    const id = 1;
    const mockUsuarioById = { id, nome: 'Teste', email: 'teste@teste.com', senha: 'senha123' };

    Usuario.findByPk.mockResolvedValue(mockUsuarioById);

    const response = await request(app)
      .get(`/usuario/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(mockUsuarioById);
  });

  it('Deve atualizar um usuário por ID com autenticação', async () => {
    const loginUsuario = {
      email: 'teste@teste.com',
      senha: 'senha123'
    };

    const mockUsuario = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: await bcrypt.hash('senha123', 10) // Senha hasheada
    };

    Usuario.findOne.mockResolvedValue(mockUsuario);

    const loginResponse = await request(app)
      .post('/usuario/login')
      .send(loginUsuario)
      .expect(200);

    const token = loginResponse.body.token;

    const id = 1;
    const updatedData = { nome: 'Teste Atualizado', email: 'atualizado@teste.com', senha: 'novaSenha123' };

    Usuario.update.mockResolvedValue([1]);

    const response = await request(app)
      .put(`/usuario/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.message).toBe('Usuario Atualizado com sucesso');
  });

  it('Deve excluir um usuário por ID com autenticação', async () => {
    const loginUsuario = {
      email: 'teste@teste.com',
      senha: 'senha123'
    };

    const mockUsuario = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: await bcrypt.hash('senha123', 10) // Senha hasheada
    };

    Usuario.findOne.mockResolvedValue(mockUsuario);

    const loginResponse = await request(app)
      .post('/usuario/login')
      .send(loginUsuario)
      .expect(200);

    const token = loginResponse.body.token;

    const id = 1;

    Usuario.destroy.mockResolvedValue(1);

    const response = await request(app)
      .delete(`/usuario/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Usuario Excluído com sucesso');
  });
});
