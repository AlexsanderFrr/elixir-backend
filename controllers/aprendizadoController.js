const express = require('express');
const router = express.Router();
const { perguntas_respostas } = require('../models'); // Supondo que você tenha um modelo PerguntaResposta

// Cadastrar Pergunta e Resposta (Endpoint aprendizado)
router.post('/add', async (req, res) => {
  try {
    const { pergunta, resposta, categoria, ativo } = req.body;
    const newPerguntaResposta = await perguntas_respostas.create({
      pergunta,
      resposta,
      categoria,
      ativo,
    });
    res.status(200).json({ message: 'Pergunta e resposta cadastradas com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buscar todas as perguntas e respostas (Endpoint aprendizado)
router.get('/all', async (req, res) => {
  try {
    const perguntasRespostas = await PerguntaResposta.findAll();
    res.status(200).json(perguntasRespostas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Alterar pergunta e resposta por id (Endpoint aprendizado)
router.put('/:id', async (req, res) => {
  try {
    const { pergunta, resposta, categoria, ativo } = req.body;
    await PerguntaResposta.update(
      { pergunta, resposta, categoria, ativo },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({ message: 'Pergunta e resposta atualizadas com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar pergunta e resposta por id (Endpoint aprendizado)
router.delete('/aprendizado/:id', async (req, res) => {
  try {
    await PerguntaResposta.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: 'Pergunta e resposta excluídas com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
