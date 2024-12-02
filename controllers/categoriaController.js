const express = require('express');
const router = express.Router();
const Categoria = require('../models').Categoria;

// Cadastrar Categoria
router.post('/add', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const newCategoria = await Categoria.create({ nome, descricao });
    res.status(200).json({ message: 'Categoria cadastrada com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Busca todas as categorias
router.get('/all', async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Busca por id da categoria
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = await Categoria.findByPk(id);
    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Alterar categoria por id
router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    await Categoria.update(
      { nome, descricao },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar categoria por id
router.delete('/:id', async (req, res) => {
  try {
    await Categoria.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: 'Categoria excluída com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
