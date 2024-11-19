const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3Setup");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { Usuario } = require("../models");
const authenticateToken = require("../middlewares/authMiddleware");
require('dotenv').config();

// Configuração do multer com multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `${process.env.S3_BUCKET_FOLDER_USER}/${file.originalname}`);
    },
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

// Adicionar Usuario (POST)
router.post("/add", upload.single("imagem"), async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);

    const newUsuario = await Usuario.create({ nome, email, senha: hashedSenha });

    if (req.file) {
      const newFileName = `${newUsuario.id}_${req.file.originalname}`;
      const imageUrl = `${process.env.S3_BASE_URL}${process.env.S3_BUCKET_FOLDER_USER}/${newFileName}`;
      newUsuario.imagem = imageUrl;

      await Usuario.update(
        { imagem: imageUrl },
        { where: { id: newUsuario.id } }
      );
    }

    res.status(200).json({ message: "Usuario Cadastrado com sucesso", usuario: newUsuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login (POST)
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: "Autenticado com sucesso", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buscar todos os Usuarios
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buscar informações do usuário autenticado (GET)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Alterar Usuario (PUT)
router.put("/me", upload.single("imagem"), async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);
    const updatedData = {
      nome,
      email,
      senha: hashedSenha,
    };

    if (req.file) {
      const newFileName = `${req.user.id}_${req.file.originalname}`;
      const imageUrl = `${process.env.S3_BASE_URL}${process.env.S3_BUCKET_FOLDER_USER}/${newFileName}`;
      updatedData.imagem = imageUrl;
    }

    await Usuario.update(updatedData, { where: { id: req.user.id } });
    res.status(200).json({ message: "Usuario Atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar Usuario (DELETE)
router.delete("/me", authenticateToken, async (req, res) => {
  try {
    await Usuario.destroy({ where: { id: req.user.id } });
    res.status(200).json({ message: "Usuario Excluído com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
