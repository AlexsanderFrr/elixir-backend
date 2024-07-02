const express = require('express');
const multer = require('multer');
const router = express.Router();
const { AllInformations, Suco, Ingrediente, sequelize } = require('../models');
const { check, validationResult } = require('express-validator');

const randomNumber = Math.floor(Math.random() * 1000000);
const timestamp = new Date().getTime();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/imgsSucos');
  },
  filename: (req, file, cb) => {
    const uniqueIdentifier = `${timestamp}_${randomNumber}_`;
    const newFileName = uniqueIdentifier + file.originalname;
    cb(null, newFileName);
  }
});

const upload = multer({ storage });

//Fução auxiliar para consultar informaçoes de ingredientes
const getIngredientesInfo = async (ingredientes) => {
  return Promise.all(ingredientes.map(id => Ingrediente.findByPk(id)));
};

//Middleware de validaçoes para criação e atualização de sucos
const validateSuco =[
  check('nome').notEmpty().withMessage('Nome é obrigatório'),
  check('ingredientes').isArray().withMessage('Ingredientes são obrigatórios'),
  check('modo_de_preparo').notEmpty().withMessage(' Modo de preparo é obrigatorio'),
  check('beneficios').notEmpty().withMessage('Beneficios são obrigatorios'), 
  (req, res, next) => {
    const errors =validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() });
  }
  next();

}

];


// Adicionar suco
router.post('/add', upload.single('img1'), validateSuco, async (req, res) => {
  try {
    const { nome, ingredientes, modo_de_preparo, beneficios } = req.body;
    const sucoImg1 = req.file.filename;

    // Consultar informações completas de ingredientes pelos IDs
    const ingredientesInfo = await getIngredientesInfo(ingredientes);

    // Crie o suco no banco de dados com as informações completas
    const newSuco = await Suco.create({ nome, modo_de_preparo, beneficios, img1: sucoImg1 });

    // Associe os ingredientes ao novo suco
    await newSuco.setIngredientes(ingredientesInfo);

    // Adicione informações na tabela AllInformations
    const allInformation = await AllInformations.create({
      fk_suco: newSuco.id,
      fk_diagnostico: null, // Adapte isso se necessário
      fk_ingredientes: ingredientes, // Adaptar se necessário
    });

    res.status(200).json({ message: 'Suco Cadastrado com sucesso', suco: newSuco, allInformation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  //Rota para bucar todos os sucos e suas informações
  router.get('/all', async (req, res) => {
    try {
        // Certifique-se de que a instância do Sequelize está associada ao modelo corretamente
        if (!sequelize) {
            throw new Error('Sequelize instance not found on AllInformations model');
        }

        // Faça a consulta SQL utilizando o Sequelize
        const allInformation = await sequelize.query("SELECT * FROM viewallinformation", {
            type: sequelize.QueryTypes.SELECT
        });

        res.json(allInformation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para obter informações de AllInformations por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Certifique-se de que a instância do Sequelize está associada ao modelo corretamente
        if (!sequelize) {
            throw new Error('Sequelize instance not found on AllInformations model');
        }

        // Faça a consulta SQL utilizando o Sequelize
        const allInformation = await sequelize.query("SELECT * FROM viewallinformation WHERE id = :id", {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT
        });

        if (allInformation.length > 0) {
            res.json(allInformation);
        } else {
            throw new Error('Nenhuma informação encontrada para o ID fornecido.');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para obter informações de AllInformations por ID ou por título
router.get('/search/:title', async (req, res) => {
    const { title } = req.params;

    try {
        // Certifique-se de que a instância do Sequelize está associada ao modelo corretamente
        if (!sequelize) {
            throw new Error('Sequelize instance not found on AllInformations model');
        }

        // Faça a consulta SQL utilizando o Sequelize
        const allInformation = await sequelize.query(
            `
            SELECT * 
            FROM viewallinformation
            WHERE nome_suco LIKE :searchTerm 
               OR nome_da_condicao LIKE :searchTerm
            `,
            {
                replacements: { searchTerm: `%${title}%` },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (allInformation.length > 0) {
            res.json(allInformation);
        } else {
            throw new Error('Nenhum resultado encontrado para o termo de pesquisa.');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para atualizar informações de AllInformations por ID
router.put('/update/:id', validateSuco, async (req, res) => {
    
      const { id } = req.params;
      const { fk_suco, fk_diagnostico, ingredientes, diagnosticos } = req.body;
      try {
      // Certifique-se de que a instância do Sequelize está associada ao modelo corretamente
      if (!sequelize) {
        throw new Error('Sequelize instance not found on AllInformations model');
        
        
        
      }
  
      // Verifique se a instância existe antes de tentar atualizar
      const existingRecord = await AllInformations.findByPk(id);
  
      if (!existingRecord) {
        throw new Error('Nenhuma informação encontrada para o ID fornecido.');
      }
  
      // Atualize os campos necessários
      existingRecord.fk_suco = fk_suco;
      existingRecord.fk_diagnostico = fk_diagnostico;
      existingRecord.ingredientes = JSON.stringify(ingredientes);
      existingRecord.diagnosticos = JSON.stringify(diagnosticos);
  
      // Salve as alterações no banco de dados
      await existingRecord.save();
  
      res.json(existingRecord);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Rota para excluir informações de AllInformations por ID
router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Certifique-se de que a instância do Sequelize está associada ao modelo corretamente
      if (!sequelize) {
        throw new Error('Sequelize instance not found on AllInformations model');
      }
  
      // Verifique se a instância existe antes de tentar excluir
      const existingRecord = await AllInformations.findByPk(id);
  
      if (!existingRecord) {
        throw new Error('Nenhuma informação encontrada para o ID fornecido.');
      }
  
      // Exclua o registro do banco de dados
      await existingRecord.destroy();
  
      res.json({ message: 'Registro excluído com sucesso.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });





module.exports = router;
