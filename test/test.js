const request = require('supertest');
const assert = require('assert').strict;
const server = require('../index.js'); 

describe('Teste do servidor da minha aplicação', () => {
    after(() => {
        server.close(); 
    });

    it('deve obter a rota principal', async () => {
        const res = await request(server).get('/');

        assert.equal(res.status, 200, 'Status da resposta deve ser 200');
        assert.equal(res.text, 'HELLO WORLD, ROTAS OK', 'Resposta deve conter a mensagem correta');
    });
});
