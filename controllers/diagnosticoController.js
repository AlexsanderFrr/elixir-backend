const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const Diagnostico = require('../models').Diagnostico;

//Cadastrar Diagnostico
router.post('/add', async (req, res)=> {
    try{
        const{nome_da_condicao, descricao} = req.body;
        const newDiagnostico = await Diagnostico.create({nome_da_condicao, descricao})
        res.status(200).json({message: 'Diagnostico cadastrado com sucesso!'});
    }catch (error){
        res.status(200).useChunkedEncodingByDefault({error: error.message});
    }
});

module.exports = router;