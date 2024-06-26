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
        res.status(400).json({ error: error.message });
    }
});

//Busca todos os diagnosticos
router.get('/all', async (req, res)=>{
    try{
        const diagnosticos = await Diagnostico.findAll();
        res.status(200).json(diagnosticos);
    }catch (error){
        res.status(400).json({error: error.message});
    }
});

//Busca por id do diagnostico
router.get('/:id', async (req, res)=>{
    try{
        const id = req.params;
        const diagnostico = await Diagnostico.findByPk(req.params.id);
        res.status(200).json(diagnostico);
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

//Alterar diagnostico por id
router.put('/:id', async (req, res)=> {
    try{
        const{nome_da_condicao, descricao} = req.body;
        await Diagnostico.update(
            { nome_da_condicao, descricao},
            {
                where: {id: req.params.id},
            }
        );
        res.status(200).json({message: 'Diagnostico atualizado com sucesso'});
    }catch (error){
        res.status(400).json({error: error.message});
    }
});

//Deletar diagnostico por id
router.delete('/:id', async (req, res)=> {
    try{
        await Diagnostico.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({message: 'Diagnostico excluido com suceso!'})
    }catch (error){
        res.status(400).json({error: error.message});
    }
});

module.exports = router;