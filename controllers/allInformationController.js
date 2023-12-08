const express = require('express');
const router = express.Router();
const { AllInformations, sequelize } = require('../models');
const { check, validationResult } = require('express-validator');



//Rota para criar um novo All Information
router.post(
  '/add/:fk_suco',
  [
    check('ingredientes')
      .isArray()
      .withMessage('O campo ingredientes deve ser um array de IDs de ingredientes'),
    check('diagnosticos')
      .isArray()
      .withMessage('O campo diagnosticos deve ser um array de IDs de diagnosticos'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { fk_suco, fk_diagnostico } = req.params;
      const { ingredientes, diagnosticos } = req.body;

      // Crie uma nova instância de AllInformations com os arrays ingredientes e diagnosticos
      const allInformation = await AllInformations.create({
        fk_suco,
        fk_diagnostico,
        ingredientes: JSON.stringify(ingredientes),
        diagnosticos: JSON.stringify(diagnosticos),
      });

      res.json(allInformation);
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





module.exports = router;
