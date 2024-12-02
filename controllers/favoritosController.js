// controllers/favoritoController.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware"); // Importa o middleware de autenticação
const { Suco, Usuario, Favorito } = require("../models"); // Assumindo que você tem um modelo Favorito
const { Op } = require("sequelize");

// Adicionar suco aos favoritos (protege com autenticação)
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body; 

    // Verifica se o suco existe
    const suco = await Suco.findByPk(id);
    if (!suco) {
      return res.status(404).json({ message: "Suco não encontrado" });
    }

    // Verifica se o favorito já existe
    const favoritoExistente = await Favorito.findOne({
      where: {
        suco_id: id,
        usuario_id: req.user.id, // Associando ao usuário autenticado
      },
    });

    if (favoritoExistente) {
      return res.status(400).json({ message: "Suco já adicionado aos favoritos" });
    }

    // Adiciona o suco aos favoritos do usuário
    await Favorito.create({
      suco_id: id,
      usuario_id: req.user.id, // Usa o ID do usuário autenticado
    });

    res.status(200).json({ message: "Suco adicionado aos favoritos com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obter todos os favoritos do usuário autenticado
router.get("/all", authenticateToken, async (req, res) => {
    try {
      // Recupera todos os sucos favoritos do usuário autenticado
      const favoritos = await Favorito.findAll({
        where: {
          usuario_id: req.user.id,
        },
        include: [
          {
            model: Suco,
            as: 'suco', // Usando o alias correto 'suco'
            attributes: ['id', 'nome', 'ingredientes', 'modo_de_preparo', 'beneficios', 'img1'] // Inclui os dados do suco
          }
        ],
      });
  
      if (favoritos.length === 0) {
        return res.status(404).json({ message: "Nenhum favorito encontrado" });
      }
  
      res.status(200).json(favoritos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

// Remover suco dos favoritos (protege com autenticação)
router.delete("/delete/:sucoId", authenticateToken, async (req, res) => {
  try {
    const sucoId = req.params.sucoId;

    // Verifica se o suco está nos favoritos do usuário
    const favorito = await Favorito.findOne({
      where: {
        suco_id: sucoId,
        usuario_id: req.user.id, // Verifica se o favorito é do usuário autenticado
      },
    });

    if (!favorito) {
      return res.status(404).json({ message: "Favorito não encontrado" });
    }

    // Remove o suco dos favoritos do usuário
    await favorito.destroy();

    res.status(200).json({ message: "Suco removido dos favoritos com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
