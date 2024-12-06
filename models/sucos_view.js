'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SucoView extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Se necessário, defina associações aqui
      // Por exemplo, se a view tivesse uma associação com outra tabela, poderia ser definida aqui
    }
  }

  SucoView.init({
    suco_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    suco_nome: {
      type: DataTypes.STRING,
    },
    ingredientes: {
      type: DataTypes.TEXT,
    },
    modo_de_preparo: {
      type: DataTypes.TEXT,
    },
    beneficios: {
      type: DataTypes.TEXT,
    },
    img1: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
    },
    categoria_nome: {
      type: DataTypes.STRING,
    },
    categoria_descricao: {
      type: DataTypes.TEXT,
    },
    diagnostico_id: {
      type: DataTypes.INTEGER,
    },
    diagnostico_nome_da_condicao: {
      type: DataTypes.STRING,
    },
    diagnostico_descricao: {
      type: DataTypes.TEXT,
    },
    diagnostico_createdAt: {
      type: DataTypes.DATE,
    },
    diagnostico_updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'SucoView',
    tableName: 'sucosview',  // Nome da view no banco de dados
    timestamps: false,  // Se a view não tem timestamps, deixe como false
  });

  return SucoView;
};
