require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('../middlewares/passportConfig');
const Usuario = require('../models').Usuario;
//const { SECRET_KEY } = process.env;
const SECRET_KEY = process.env.SECRET_KEY;
const authenticateToken = passport.authenticate('jwt', { session: false });
//const authenticateToken = require('../middlewares/authMiddleware');

//const SECRET_KEY = 'your_secret_key'; // Use uma chave secreta segura e armazenada em variáveis de ambiente

// Cadastra Usuario (POST)
router.post('/add', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const hashedSenha = await bcrypt.hash(senha, 10); // Hash da senha
        const newUsuario = await Usuario.create({ nome, email, senha });
        res.status(200).json({ message: 'Usuario Cadastrado com sucesso', usuario: newUsuario });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login (POST)
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ message: 'Email ou senha inválidos' });
        }

        const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email ou senha inválidos' });
        }

        const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Autenticado com sucesso', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Buscar todos os Usuarios
router.get('/all', authenticateToken, async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Busca Por id do Usuario (GET)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Alterar Usuario por ID (PUT)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const hashedSenha = await bcrypt.hash(senha, 10);
        await Usuario.update(
            { nome, email, senha: hashedSenha },
            { where: { id: req.params.id } }
        );
        res.status(200).json({ message: 'Usuario Atualizado com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Deletar Usuario por id (DELETE)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Usuario.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Usuario Excluído com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
