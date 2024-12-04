'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class perguntas_respostas extends Model {
    static associate(models) {
      // Defina as associações aqui, se necessário
    }
  }

  perguntas_respostas.init({
    pergunta: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resposta: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: true, 
      defaultValue: true 
    }
  }, {
    sequelize,
    modelName: 'perguntas_respostas',
    tableName: 'perguntas_respostas', 
    timestamps: true,
  });

  return perguntas_respostas;
};
