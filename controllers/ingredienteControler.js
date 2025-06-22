const express = require('express');
const multer = require('multer');
const router = express.Router();
const randomNumber = Math.floor(Math.random() * 1000000);
const timestamp = new Date().getTime();


const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/imgsIngredientes');
    },
    filename: function (req, file, cb){
        const uniqueIdentifier = `${timestamp}_${randomNumber}_`;
        const newFileName = uniqueIdentifier + file.originalname;
        cb(null, newFileName);
    } 
});

const upload = multer({storage});
const Ingrediente = require ('../models').Ingrediente;

// Adicionar Ingrediente
router.post('/add', upload.single('img'), async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        console.log(req.body)
        console.log(nome)
        // Use o novo nome do arquivo que inclui o identificador único
        const newIngrediente = await Ingrediente.create({ nome, descricao, img: req.file.filename });

        res.status(200).json({ message: 'Ingrediente Cadastrado com sucesso'});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Buscar todos os ingredientes
router.get('/all', async (req, res)=>{
    try{
        const ingredientes = await Ingrediente.findAll();
        const ingredientesWithImagePaths = ingredientes.map(ingredientes => {
            if (ingredientes.img){
                const imagePath = `/img/${ingredientes.img}`;
                return{
                    ...ingredientes.dataValues,
                    img: imagePath,
                };
            }else{
                return{ ...ingredientes.dataValues, img: null};
            }
        });
        res.status(200).json(ingredientesWithImagePaths);
    }catch (error){
        console.error(error);
        res.status(500).json({error: 'Erro interno no servidor'})
    }
});

//Busca por id ingredientes
router.get('/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const ingredientes = await Ingredientes.findByPk(id);

        if (!suco){
            throw new Error('Ingrediente não encontrado');
        }

        const imagePath = ingredientes.img ? `/img/${ingredientes.img}` : null;
        const ingredientesWithImagePaths = {
            ...ingredientes.dataValues,
            img: imagePath,
        };

        res.status(200).json(ingredientesWithImagePaths);
    }catch (error){
        res.status(400).json({error: error.message});
    }
});

//alterar Ingredientes por id 
router.put('/:id', upload.single('img'), async (req, res)=>{
    try{
        const {nome, beneficios} = req.body;

        const img = req.file ? req.file.filename : undefined;

        await Ingredientes.update(
            { nome, beneficios, img},
            {
                where: {id: req.params.id},
            }
        );
        res.status(200).json({message: 'Ingrediente atualizado com sucesso'});
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

//Deletar ingrediente por id
router.delete('/:id', async (req, res)=>{
    try{
        await Ingredientes.destroy({
            where:{
                id: req.params.id,
            },
        });
        res.status(200).json({ message: 'Ingrediente excluido com sucesso!'})
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

module.exports = router;