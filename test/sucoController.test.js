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
 
//Teste cadastrar suco
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

  //teste listar todosos sucos
  it ('Deve listar todos os sucos', async () => {
    const mockSucos = [
      {id: 1, nome: 'suco de laranja', img1: 'suco1.png'},
      {id: 2, nome: 'suco de uva', img1: 'suco2.png'},
    ];

    Suco.findAll.mockResolvedValue(mockSucos);
    request(app)
      .get(`/sucos/all`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.length).toBe(2);
        expect(res.body[0].id).toBe(1);
        expect(res.body[0].nome).toBe('suco de laranja');
        expect(res.body[0].img1).toBe('suco1.png');
        expect(res.body[1].id).toBe(2);
        expect(res.body[1].nome).toBe('suco de uva');
        expect(res.body[1].img1).toBe('suco2.png');
        done();
      });
    
  }); 

  it('Deve alterar um suco', async () => {
    const idSuco = 1;
    const sucoAtualizado = {
      nome: 'Suco Atualizado',
      ingredientes: 'Limão, água e açucar',
      modo_de_preparo: 'cortar limão adiciona água e açucar',
      beneficios: 'aumenta a imunidade', 
      };

      
    // Mock da função update do modelo Ingredien
    Suco.update.mockResolvedValue([1]); // Indica que uma linha foi afetada

    request(app)
      .put(`/sucos/${idSuco}`)
      .send(sucoAtualizado)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Suco atualizado com sucesso');
        done();
      });
  });


});
