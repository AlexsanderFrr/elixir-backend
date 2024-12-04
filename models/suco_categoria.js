'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sucos_Categorias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define a associação entre Suco e Categoria
      Sucos_Categorias.belongsTo(models.Suco, { foreignKey: 'suco_id' });
      Sucos_Categorias.belongsTo(models.Categoria, { foreignKey: 'categoria_id' });
    }
  }

  // Inicializando o modelo Suco_Categoria com seus campos
  Sucos_Categorias.init({
    suco_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Sucos_Categorias',
    timestamps: false, // Não temos campos de timestamp na tabela de associação
  });

  return Sucos_Categorias;
};
