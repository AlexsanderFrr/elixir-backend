'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Suco extends Model {
 
    static associate(models) {
      // define association here
    }
  }
  Suco.init({
    nome: DataTypes.STRING,
    ingredientes: DataTypes.STRING,
    modo_de_preparo: DataTypes.STRING,
    beneficios: DataTypes.STRING,
    img1: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Suco',
  });
  return Suco;
};