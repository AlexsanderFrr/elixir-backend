'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Suco_Diagnostico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Suco_Diagnostico.init({
    fk_suco: DataTypes.INTEGER,
    fk_diagnostico: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Suco_Diagnostico',
  });
  return Suco_Diagnostico;
};