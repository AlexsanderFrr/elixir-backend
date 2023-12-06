const express = require('express');
const multer = require('multer');
const router = express.Router();
const randomNumber = Math.floor(Math.random() * 1000000);
const timestamp = new Date().getTime();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/imgsSucos'); 
  },
  filename: function (req, file, cb) {
    const uniqueIdentifier = `${timestamp}_${randomNumber}_`;
    const newFileName = uniqueIdentifier + file.originalname;
    cb(null, newFileName);
  }
});

const upload = multer({ storage });
const Suco = require('../models').Suco;

// Adicionar suco
router.post('/add', upload.single('img1'), async (req, res) => {
    try {
        const { nome, ingredientes, modo_de_preparo, beneficios, img1 } = req.body;

        // Use os novos nomes dos arquivos que incluem os identificadores únicos

        const newSuco = await Suco.create({ nome, ingredientes, modo_de_preparo, beneficios, img1: req.file.filename });

        res.status(200).json({ message: 'Suco Cadastrado com sucesso', suco: newSuco });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
