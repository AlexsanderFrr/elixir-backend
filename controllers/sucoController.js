const express = require("express");
const multer = require("multer");
const router = express.Router();
const randomNumber = Math.floor(Math.random() * 1000000);
const timestamp = new Date().getTime();
const { Op } = require("sequelize");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/imgsSucos");
  },
  filename: function (req, file, cb) {
    const uniqueIdentifier = `${timestamp}_${randomNumber}_`;
    const newFileName = uniqueIdentifier + file.originalname;
    cb(null, newFileName);
  },
});

const upload = multer({ storage });
const { Suco, Diagnostico, Suco_Diagnostico, sequelize } = require("../models");

// Adicionar suco
router.post("/add", upload.single("img1"), async (req, res) => {
  try {
    const {
      nome,
      ingredientes,
      modo_de_preparo,
      beneficios,
      img1,
      diagnostico,
    } = req.body;

    const suco = await Suco.create({
      nome,
      ingredientes,
      modo_de_preparo,
      beneficios,
      img1: req.file.filename,
    });

    // Associar diagnóstico ao suco na tabela Suco_Diagnostico
    if (diagnostico) {
      // Mapear ID do diagnóstico para um objeto de diagnóstico
      const diagnosticoObj = await Diagnostico.findByPk(diagnostico);

      // Associar o diagnóstico ao suco na tabela Suco_Diagnostico
      await Suco_Diagnostico.create({
        fk_suco: suco.id,
        fk_diagnostico: diagnosticoObj.id,
      });

      // Incluir informações sobre o diagnóstico no retorno
      suco.diagnostico = diagnosticoObj;
    }

    res.status(200).json({ message: "Suco Cadastrado com sucesso", suco });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Buscar todos os Sucos
router.get("/all", async (req, res) => {
  try {
    const suco = await Suco.findAll();

    const sucosWithImagePaths = suco.map((suco) => {
      if (suco.img1) {
        const imagePath = `/img/${suco.img1}`;
        return {
          ...suco.dataValues,
          img1: imagePath,
        };
      } else {
        return { ...suco.dataValues, img1: null };
      }
    });
    res.status(200).json(sucosWithImagePaths);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

//Busca por id Suco
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const suco = await Suco.findByPk(id);

    if (!suco) {
      throw new Error("Receita não encontrado");
    }

    const imagePath = suco.img1 ? `/img/${suco.img1}` : null;
    const sucosWithImagePaths = {
      ...suco.dataValues,
      img1: imagePath,
    };

    res.status(200).json(sucosWithImagePaths);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para buscar um Suco através do título
router.get("/title/:title", async (req, res) => {
  // Obtenha o título da consulta
  const { title } = req.params; // Use req.params em vez de req.query

  try {
    const suco = await Suco.findAll({
      where: {
        nome: {
          [Op.like]: `%${title}%`,
        },
      },
    });

    const sucosWithImagePaths = suco.map((suco) => {
      const imagePath = suco.img1 ? `/img/${suco.img1}` : null;
      return {
        ...suco.dataValues,
        img1: imagePath,
      };
    });

    if (sucosWithImagePaths.length > 0) {
      res.json(sucosWithImagePaths);
    } else {
      throw new Error(
        "Nenhuma receita de suco encontrada com o título fornecido"
      );
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para obter suco e diagnóstico associado por ID
router.get("/with-diagnostico/:id", async (req, res) => {
  const sucoDiagnosticoId = req.params.id;

  try {
    const sucoDiagnostico = await Suco_Diagnostico.sequelize.query(
      `
      SELECT * 
      FROM suco_diagnostico_all WHERE fk_suco = :id
      `,
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


//alterar Suco por id (PUT)
router.put("/:id", upload.single("img1"), async (req, res) => {
  try {
    const { nome, ingredientes, modo_de_preparo, beneficios } = req.body;

    const img1 = req.file ? req.file.filename : undefined;

    await Suco.update(
      { nome, ingredientes, modo_de_preparo, beneficios, img1 },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({ message: "Suco atualizado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Deletar Suco por id
router.delete("/:id", async (req, res) => {
  try {
    await Suco.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Suco excluido com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
