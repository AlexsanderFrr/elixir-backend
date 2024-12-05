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
    }
  }
  // Inicializando o modelo Suco_Categoria com seus campos
  Sucos_Categorias.init({
        suco_id: DataTypes.INTEGER,
        categoria_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sucos_Categorias',
    timestamps: false, 
  });

  return Sucos_Categorias;
};
