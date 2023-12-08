'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AllInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AllInformation.init({
    fk_suco: DataTypes.INTEGER,
    fk_ingredientes: DataTypes.INTEGER,
    fk_diagnostico: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AllInformation',
  });
  return AllInformation;
};