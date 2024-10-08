require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Usuario = require("../models").Usuario;
const SECRET_KEY = process.env.SECRET_KEY;
const authenticateToken = require("../middlewares/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configuração do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/imgUsuario");
  },
  filename: function (req, file, cb) {
    const uniqueIdentifier = `${timestamp}_${randomNumber}_`;
    const newFileName = uniqueIdentifier + file.originalname;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

// Função para mover a imagem para a pasta imgUsuario
const moveFile = (filePath, fileName) => {
  const destinationDir = path.join(__dirname, "..", "imgUsuario");
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }
  const destinationPath = path.join(destinationDir, fileName);
  fs.renameSync(filePath, destinationPath);
  return destinationPath;
};

// Adicionar Usuario (POST)
router.post("/add", upload.single("imagem"), async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);
    
    console.log('Hash gerado para a senha:', hashedSenha); // Adicione este log

    let imagePath = null;

    if (req.file) {
      const tempPath = req.file.path;
      const fileName = req.file.filename;
      imagePath = moveFile(tempPath, fileName);
    }

    const newUsuario = await Usuario.create({
      nome,
      email,
      senha: hashedSenha,
      imagem: imagePath,
    });

    res.status(200).json({ message: "Usuario Cadastrado com sucesso", usuario: newUsuario });
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
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Busca informações do usuário autenticado (GET)
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
    await Usuario.update(
      {
        nome,
        email,
        senha: hashedSenha,
        imagem: req.file ? req.file.filename : undefined, // Atualiza o caminho da imagem
      },
      { where: { id: req.user.id } }
    );
    res.status(200).json({ message: "Usuario Atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar Usuario por id (DELETE)
router.delete("/me", authenticateToken, async (req, res) => {
  try {
    await Usuario.destroy({ where: { id: req.user.id } });
    res.status(200).json({ message: "Usuario Excluído com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
