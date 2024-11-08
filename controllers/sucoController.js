// controllers/sucoController.js

const express = require("express");
const multer = require("multer");
const { CopyObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3Setup"); // Importando o cliente S3 configurado
const router = express.Router();
const { Op } = require("sequelize");
const { Suco, Diagnostico, Suco_Diagnostico, sequelize } = require("../models");
require('dotenv').config(); // Carregar variáveis do .env

// Configuração do multer com multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `${process.env.S3_BUCKET_FOLDER_SUCO}/${file.originalname}`);
    }
  })
});

// Adicionar suco
router.post("/add", upload.single("img1"), async (req, res) => {
  try {
    const { nome, ingredientes, modo_de_preparo, beneficios, diagnostico } = req.body;

    const suco = await Suco.create({ nome, ingredientes, modo_de_preparo, beneficios });

    if (req.file) {
      const newFileName = `${suco.id}_${req.file.originalname}`;
      const imageUrl = `${process.env.S3_BASE_URL}/${process.env.S3_BUCKET_FOLDER_SUCO}/${newFileName}`;

      await s3.send(new CopyObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        CopySource: `${process.env.S3_BUCKET_NAME}/${req.file.key}`,
        Key: `${process.env.S3_BUCKET_FOLDER_SUCO}/${newFileName}`,
        ContentDisposition: "inline"
      }));

      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: req.file.key
      }));

      suco.img1 = imageUrl; // Salva a URL da imagem
    }

    if (diagnostico) {
      const diagnosticoObj = await Diagnostico.findByPk(diagnostico);
      await Suco_Diagnostico.create({
        fk_suco: suco.id,
        fk_diagnostico: diagnosticoObj.id,
      });
      suco.diagnostico = diagnosticoObj;
    }

    await Suco.update(
      { img1: suco.img1 }, // Atualiza com a URL da imagem
      { where: { id: suco.id } }
    );

    res.status(200).json({ message: "Suco Cadastrado com sucesso", suco });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Obter todos os sucos
router.get("/all", async (req, res) => {
  try {
    const suco = await Suco.findAll();
    res.status(200).json(suco);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Obter suco por ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const suco = await Suco.findByPk(id);

    if (!suco) {
      throw new Error("Receita não encontrada");
    }

    res.status(200).json(suco);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obter suco por título
router.get("/title/:title", async (req, res) => {
  const { title } = req.params;

  try {
    const sucos = await Suco.findAll({
      where: {
        nome: {
          [Op.like]: `%${title}%`,
        },
      },
    });

    if (sucos.length > 0) {
      res.json(sucos);
    } else {
      throw new Error("Nenhuma receita de suco encontrada com o título fornecido");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obter sucos com diagnóstico específico
router.get("/with-diagnostico/:id", async (req, res) => {
  const sucoDiagnosticoId = req.params.id;

  try {
    const sucoDiagnostico = await Suco_Diagnostico.sequelize.query(
      `SELECT * FROM suco_diagnostico_all WHERE fk_suco = :id`,
      {
        replacements: { id: sucoDiagnosticoId },
        type: Suco_Diagnostico.sequelize.QueryTypes.SELECT,
      }
    );

    if (sucoDiagnostico.length > 0) {
      res.json(sucoDiagnostico);
    } else {
      throw new Error("Nenhum resultado encontrado para o ID do suco.");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar suco
router.put("/:id", upload.single("img1"), async (req, res) => {
  try {
    const { nome, ingredientes, modo_de_preparo, beneficios } = req.body;
    const img1 = req.file ? req.file.location : undefined;

    await Suco.update(
      { nome, ingredientes, modo_de_preparo, beneficios, img1 },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: "Suco atualizado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar suco
router.delete("/:id", async (req, res) => {
  try {
    await Suco.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Suco excluído com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
