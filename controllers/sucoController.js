// controllers/sucoController.js
const express = require("express");
const multer = require("multer");
const {
  DeleteObjectCommand,
  CopyObjectCommand,
} = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3Setup");
const router = express.Router();
const { Op } = require("sequelize");
const {
  Suco,
  Diagnostico,
  Categoria,
  Suco_Diagnostico,
  Sucos_Categorias,
} = require("../models");
require("dotenv").config();

// Configuração do multer com multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `${process.env.S3_BUCKET_FOLDER_SUCO}/${file.originalname}`); // Salva o arquivo original no S3
    },
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

// Adicionar suco
router.post("/add", upload.single("img1"), async (req, res) => {
  try {
    const {
      nome,
      ingredientes,
      modo_de_preparo,
      beneficios,
      diagnostico,
      categoria,
    } = req.body;

    // Cria o suco no banco de dados
    const suco = await Suco.create({
      nome,
      ingredientes,
      modo_de_preparo,
      beneficios,
      img1: req.file.key, // Salva o nome original do arquivo no banco de dados
    });

    // Se a imagem foi carregada, renomeia e move para o S3 com o ID do suco
    if (req.file) {
      const newFileName = `${suco.id}_${req.file.originalname}`; // Nome da imagem com o ID
      const imageUrl = `${process.env.S3_BASE_URL}${process.env.S3_BUCKET_FOLDER_SUCO}/${newFileName}`; // URL da imagem

      // Copia o arquivo para o novo nome no S3
      await s3.send(
        new CopyObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          CopySource: `${process.env.S3_BUCKET_NAME}/${req.file.key}`,
          Key: `${process.env.S3_BUCKET_FOLDER_SUCO}/${newFileName}`,
        })
      );

      // Deleta o arquivo original do S3
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: req.file.key,
        })
      );

      // Atualiza o suco com a URL da nova imagem
      suco.img1 = imageUrl;
    }

    // Associar diagnósticos ao suco na tabela Suco_Diagnostico
    if (diagnostico) {
      const diagnosticoObj = await Diagnostico.findByPk(diagnostico);
      await Suco_Diagnostico.create({
        fk_suco: suco.id,
        fk_diagnostico: diagnosticoObj.id,
      });
      suco.diagnostico = diagnosticoObj;
    }

    // Associar a categoria ao suco na tabela Suco_Categoria
    if (categoria) {
      const categoriaObj = await Categoria.findByPk(categoria); 
        await Sucos_Categorias.create({
          suco_id: suco.id,
          categoria_id: categoriaObj.id, 
        });
        suco.categoria = categoriaObj;
      }
    

    // Atualiza o suco no banco de dados com a URL da imagem
    await suco.update({ img1: suco.img1 }, { where: { id: suco.id } });

    // Retorna o suco com sucesso
    res.status(200).json({ message: "Suco Cadastrado com sucesso", suco });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obter todos os sucos
router.get("/all", async (req, res) => {
  try {
    const sucos = await Suco.findAll();
    res.status(200).json(sucos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

router.get("/filter", async (req, res) => {
  try {
    const { categoria, diagnostico } = req.query;

    // Construir a consulta para filtrar sucos
    let query = {
      include: [],
      where: {}
    };

    // Filtro por categoria
    if (categoria) {
      query.include.push({
        model: Categoria,
        where: { nome: categoria },
        through: { attributes: [] }  // Para evitar retornar dados da tabela de junção
      });
    }

    // Filtro por diagnóstico
    if (diagnostico) {
      query.include.push({
        model: Diagnostico,
        where: { nome_da_condicao: diagnostico },
        through: { attributes: [] }  // Para evitar retornar dados da tabela de junção
      });
    }

    // Buscar os sucos com os filtros
    const sucos = await Suco.findAll(query);

    // Verificar se os filtros foram aplicados e se houve resultados
    if ((categoria && sucos.length === 0) || (diagnostico && sucos.length === 0)) {
      //const sucos = await Suco.findAll(query);
      return res.status(404).json({ message: "Nenhum suco encontrado para os filtros aplicados." });
    }

    // Retornar os sucos filtrados
    res.status(200).json(sucos);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      throw new Error(
        "Nenhuma receita de suco encontrada com o título fornecido"
      );
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
