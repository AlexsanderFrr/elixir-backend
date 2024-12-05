'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Suco, { through: 'Sucos_Categorias', foreignKey: 'categoria_id' });
    }
  }
  Categoria.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Categoria',
    timestamps: false // Desabilita os campos createdAt e updatedAt
  });
  return Categoria;
};
