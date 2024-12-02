'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorito extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Associa o modelo Favorito com o modelo Usuario
      Favorito.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
      });

      // Associa o modelo Favorito com o modelo Suco
      Favorito.belongsTo(models.Suco, {
        foreignKey: 'suco_id',
        as: 'suco',
      });
    }
  }

  // Inicialização do modelo Favorito
  Favorito.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios', // Nome da tabela associada
        key: 'id',
      },
    },
    suco_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sucos', // Nome da tabela associada
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Favorito',
    timestamps: false,
  });

  return Favorito;
};
