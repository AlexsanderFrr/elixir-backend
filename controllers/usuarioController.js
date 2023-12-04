const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

//pegamos a entidade em si dessa forma usando .Genres
const Usuario = require('../models').Usuario;

//Cadastra Usuario (POST)
router.post('/add', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const newEdit = await Usuario.create({ nome, email, senha })
        res.status(200).json({ message: 'Usuario Cadastrado com sucesso', usuario: newEdit });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Buscar todos os Usuarios
router.get('/all', async (req, res) => {
    try {
        const Usuario = await Usuario.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Busca Por id do Usuario (GET)
router.get('/:id', async (req, res) => {
    try {
        const id = req.params;
        const usuario = await Users.findByPk(req.params.id);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Alterar Usuario por ID (PUT)
router.put('/:id', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        await Usuario.update(
            { nome, email, senha },
            {
                where: { id: req.params.id },
            }
        );
        res.status(200).json({ message: 'Usuario Atualizado com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Deletar Usuario por id (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        await Usuario.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ message: 'Usuario Excluído com sucesso' })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;