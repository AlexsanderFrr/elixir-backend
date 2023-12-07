const express = require('express');
const router = express.Router();
const { Suco_Diagnostico, sequelize } = require('../models');


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

//Rota para obter suco diagnostico
router.get('/:id', async (req,res) =>{
    const {id} = req.params;
    try{
        const sucoDiagnosticos = await Suco_Diagnostico.sequelize.query("SELECT * FROM suco_diagnostico_all where id=:id", {replacements: {id: id}, type: Suco_Diagnostico.sequelize.QueryTypes.SELECT});
        if (sucoDiagnosticos){
            res.json(sucoDiagnosticos);
        }else{
            throw new Error('Suco e Diagnostico não encontrado!');
        }
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

// Rota para obter suco diagnostico por ID ou por título
router.get('/search/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const sucoDiagnosticos = await Suco_Diagnostico.sequelize.query(
            `
            SELECT * 
            FROM suco_diagnosticos AS sd
            INNER JOIN sucos AS s ON sd.fk_suco = s.id
            INNER JOIN diagnosticos AS d ON sd.fk_diagnostico = d.id
            WHERE s.nome LIKE :searchTerm 
               OR d.nome_da_condicao LIKE :searchTerm
            `,
            {
                replacements: { searchTerm: `%${title}%` },
                type: Suco_Diagnostico.sequelize.QueryTypes.SELECT
            }
        );

        if (sucoDiagnosticos.length > 0) {
            res.json(sucoDiagnosticos);
        } else {
            throw new Error('Nenhum resultado encontrado para o termo de pesquisa.');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});






module.exports = router;
