const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const sucoRouter = require('../controllers/sucoController');
const {Suco, Diagnostico, Suco_Diagnostico} = require('../models');

jest.mock('../models');

const app = express();
app.use(bodyParser.json());
app.use('/sucos', sucoRouter);

describe('Testes para o Controlador de Suco', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../controllers/sucoController')];
      jest.clearAllMocks();
    });

    it('Deve cadastrar um novo Suco', async () => {
        const novoSuco = {
          nome: 'Suco Laranja',
          ingredientes: 'Laranja e agua',
          modo_de_preparo: 'cortar e espremer',
          beneficios: 'Rico em vitamina C',
        };
        
        Suco.create.mockResolvedValue({
          id: 1,
          ...novoSuco,
          img1: 'fakeimage.png',
        });

        const mockDiagnostico = {
          id: 1,
          nome_da_condicao: 'Diagnostico teste',
          descricao: 'Descricao teste',

        };

        Diagnostico.findByPk.mockResolvedValue(mockDiagnostico);

     request(app)
      .post('/sucos/add')
      .attach('img1', path.resolve(__dirname, 'fakeimage.png'))
      .field('nome', 'Suco Laranja')
      .field('ingredientes', 'Laranja e agua')
      .field('modo_de_preparo', 'cortar e espremer')
      .field('beneficios', 'Rico em vitamina C')
      .field('diagnostico', 1)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(response.body.message).toBe('Suco Cadastrado com sucesso');
        done();
      });
  });

});
