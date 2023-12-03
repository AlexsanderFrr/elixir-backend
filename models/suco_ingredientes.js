'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Suco_Ingredientes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Suco_Ingredientes.init({
    fk_suco: DataTypes.INTEGER,
    fk_ingredientes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Suco_Ingredientes',
  });
  return Suco_Ingredientes;
};