const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { DeleteObjectCommand, CopyObjectCommand } = require("@aws-sdk/client-s3");
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
      cb(null, `${process.env.S3_BUCKET_FOLDER_USER}/${file.originalname}`); // Salva o arquivo original no S3
    },
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

// Adicionar Usuario (POST)
router.post("/add", upload.single("imagem"), async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const tipo = "comum";// força o tipo como "comum"
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Criação do usuário
    const newUsuario = await Usuario.create({ nome, email, senha: hashedSenha, tipo });

    if (req.file) {
      const newFileName = `${newUsuario.id}_${req.file.originalname}`; // Nome correto da imagem com o ID
      const imageUrl = `${process.env.S3_BASE_URL}${process.env.S3_BUCKET_FOLDER_USER}/${newFileName}`;

      // Copia o arquivo para o novo nome no S3
      await s3.send(
        new CopyObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          CopySource: `${process.env.S3_BUCKET_NAME}/${req.file.key}`,
          Key: `${process.env.S3_BUCKET_FOLDER_USER}/${newFileName}`,
        })
      );

      // Deleta o arquivo original do S3
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: req.file.key,
        })
      );

      // Atualiza o usuário com a URL da imagem
      newUsuario.imagem = imageUrl;

      // Atualiza o banco de dados com a URL da imagem
      await newUsuario.save();
    }

    // Resposta com sucesso
    res.status(200).json({ message: "Usuario Cadastrado com sucesso", usuario: newUsuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});router.post("/add", upload.single("imagem"), async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Criação do usuário
    const newUsuario = await Usuario.create({ nome, email, senha: hashedSenha });

    if (req.file) {
      const newFileName = `${newUsuario.id}_${req.file.originalname}`; // Nome correto da imagem com o ID
      const imageUrl = `${process.env.S3_BASE_URL}${process.env.S3_BUCKET_FOLDER_USER}/${newFileName}`;

      // Copia o arquivo para o novo nome no S3
      await s3.send(
        new CopyObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          CopySource: `${process.env.S3_BUCKET_NAME}/${req.file.key}`,
          Key: `${process.env.S3_BUCKET_FOLDER_USER}/${newFileName}`,
        })
      );

      // Deleta o arquivo original do S3
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: req.file.key,
        })
      );

      // Atualiza o usuário com a URL da imagem
      newUsuario.imagem = imageUrl;

      // Atualiza o banco de dados com a URL da imagem
      await newUsuario.save();
    }

    // Resposta com sucesso
    res.status(200).json({ message: "Usuario Cadastrado com sucesso", usuario: newUsuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login (POST)
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // 1. Busca o usuário incluindo o campo 'tipo'
    const usuario = await Usuario.findOne({ 
      where: { email },
      attributes: ['id', 'nome', 'email', 'senha', 'tipo', 'imagem'] // Inclua todos os campos necessários
    });

    if (!usuario) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    // 2. Verifica a senha
    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    // 3. Cria o token com mais informações do usuário
    const token = jwt.sign(
      { 
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo  // Inclui o tipo do usuário no token
      }, 
      process.env.SECRET_KEY, 
      { expiresIn: '1h' }
    );

    // 4. Retorna informações relevantes (sem a senha)
    const userData = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      imagem: usuario.imagem,
      token
    };

    res.status(200).json({ 
      message: "Autenticado com sucesso", 
      ...userData 
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor durante o login" });
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
router.put("/me", authenticateToken, upload.single("imagem"), async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const updatedData = { nome, email };

    // Se houver uma nova senha, a hash é atualizada
    if (senha) {
      updatedData.senha = await bcrypt.hash(senha, 10);
    }

    // Se houver uma nova imagem, o nome será atualizado com o ID do usuário
    if (req.file) {
      const newFileName = `${req.user.id}_${req.file.originalname}`; // Nome com ID do usuário
      const newImageUrl = `${process.env.S3_BASE_URL}${process.env.S3_BUCKET_FOLDER_USER}/${newFileName}`;

      // Copia o arquivo para o novo nome no S3
      await s3.send(
        new CopyObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          CopySource: `${process.env.S3_BUCKET_NAME}/${req.file.key}`,
          Key: `${process.env.S3_BUCKET_FOLDER_USER}/${newFileName}`,
        })
      );

      // Deleta o arquivo original do S3
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: req.file.key,
        })
      );

      // Atualiza a URL da imagem no banco de dados
      updatedData.imagem = newImageUrl;
    }

    // Atualiza o usuário no banco de dados com os novos dados
    await Usuario.update(updatedData, { where: { id: req.user.id } });
    res.status(200).json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error(error);
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
