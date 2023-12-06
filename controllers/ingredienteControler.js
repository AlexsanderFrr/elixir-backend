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
const Ingredientes = require ('../models').Ingredientes;

// Adicionar Suco
router.post('/add', upload.single('img'), async (req, res) => {
    try {
        const { nome, beneficios } = req.body;

        // Use o novo nome do arquivo que inclui o identificador único
        const newIngrediente = await Ingredientes.create({ nome, beneficios, img: req.file.filename });

        res.status(200).json({ message: 'Ingrediente Cadastrado com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Buscar todos os ingredientes
router.get('/all', async (req, res)=>{
    try{
        const ingredientes = await Ingredientes.findAll();
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


module.exports = router;