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

describe('Testes para o Controlador de Ingrediente', () => {
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

  it('Deve recuperar um ingrediente', async () => {
    const idIngrediente = 1;
    const mockIngrediente = {
      id: idIngrediente,
      nome: 'ingrediente Teste',
      beneficios: 'Descricao Teste',
      img: 'fakeimage.png'
      
    };

    // Mock da função findByPk do modelo Diagnostico
    Ingrediente.findByPk.mockResolvedValue(mockIngrediente);

    request(app)
      .get(`/ingrediente/${idIngrediente}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done (err);
        expect(res.body.id).toBe(idIngrediente);
        expect(res.body.nome).toBe(mockIngrediente.nome);
        expect(res.body.beneficios).toBe(mockIngrediente.beneficios);
        expect(res.body.img).toBe(mockIngrediente.img);
        done();
      });
  });

  it('Deve listar todos os ingredientes', async () => {
    const mockIngrediente = [
      { id: 1, nome: 'Ingrediente Teste 1', beneficios: 'Beneficio Teste 1', img: 'fakeimage1.png'},
      { id: 2, nome: 'Ingrediente Teste 2', beneficios: 'Beneficio Teste 2', img: 'fakeimage2.png'}
    ];

    // Mock da função findAll do modelo Ingrediente
    Ingrediente.findAll.mockResolvedValue(mockIngrediente);

    request(app)
      .get(`/ingredientes/all`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.length).toBe(2);
        expect(res.body[0].id).toBe(1);
        expect(res.body[0].nome).toBe('Ingrediente Teste 1');
        expect(res.body[0].beneficios).toBe('Beneficio Teste 1');
        expect(res.body[0].img).toBe('fakeimage1.png');
        expect(res.body[1].id).toBe(2);
        expect(res.body[1].nome).toBe('Ingrediente Teste 2');
        expect(res.body[1].beneficios).toBe('Beneficio Teste 2');
        expect(res.body[1].img).toBe('fakeimage2.png');
        done();
      });
  });

  it('Deve alterar um ingrediente', async () => {
    const idIngrediente = 1;
    const ingredienteAtualizado = {
      nome: 'Ingrediente Atualizado',
      beneficios: 'Beneficios Atualizado', 
      img: 'imagem Atualizada'
    };

    // Mock da função update do modelo Ingrediente
    Ingrediente.update.mockResolvedValue([1]); // Indica que uma linha foi afetada

    request(app)
      .put(`/ingrediente/${idIngrediente}`)
      .send(ingredienteAtualizado)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Ingrediente atualizado com sucesso');
        done();
      });
  });

  it('Deve deletar um ingrediente', async () => {
    const idIngrediente = 1;

    // Mock da função destroy do modelo Ingrediente
    Ingrediente.destroy.mockResolvedValue(1); // Indica que uma linha foi removida

    request(app)
      .delete(`/ingrediente/${idIngrediente}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Ingrediente excluido com sucesso!');
        done();
      });
  });

});
