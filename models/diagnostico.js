'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Diagnostico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.teste
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Suco, { through: 'Suco_Diagnostico', foreignKey: 'fk_diagnostico' });
    }
  }
  Diagnostico.init({
    nome_da_condicao: DataTypes.STRING,
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Diagnostico',
  });
  return Diagnostico;
};