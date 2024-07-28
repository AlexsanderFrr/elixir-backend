const express = require("express");
const multer = require("multer");
const router = express.Router();
const randomNumber = Math.floor(Math.random() * 1000000);
const timestamp = new Date().getTime();
const { Op } = require("sequelize");
const { Suco_Diagnostico, sequelize } = require('../models');

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



//Rota para criar um novo Suco Diagnostico
router.post('/add/:fk_suco/:fk_diagnostico', async (req, res)=>{
    try{
        const {fk_suco, fk_diagnostico} = req.params;
        const sucoDiagnosticos = await Suco_Diagnostico.create({fk_suco, fk_diagnostico});
        res.json(sucoDiagnosticos);
    }catch (error) {
        res.status(400).json({error: error.message});
    }
});


// Rota para buscar todos os sucos e seus diagnósticos
router.get('/all', async (req, res) => {
    try {
        // Certifique-se de que a instância do Sequelize está associada ao modelo corretamente
        if (!sequelize) {
            throw new Error('Sequelize instance not found on Suco_Diagnostico model');
        }

        // Faça a consulta SQL utilizando o Sequelize
        const sucoDiagnosticos = await sequelize.query("SELECT * FROM suco_diagnostico_all", {
            type: sequelize.QueryTypes.SELECT
        });

        res.json(sucoDiagnosticos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;