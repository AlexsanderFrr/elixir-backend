'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ingrediente extends Model {
    static associate(models) {
      // Exemplo de associação futura, se um dia quiser ligar ingredientes a sucos
      // this.belongsToMany(models.Suco, { through: 'Suco_Ingrediente', foreignKey: 'ingrediente_id' });
    }
  }

  Ingrediente.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    beneficios: {
      type: DataTypes.STRING,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true // Aqui você armazena apenas o nome do arquivo da imagem
    }
  }, {
    sequelize,
    modelName: 'Ingrediente',
  });

  return Ingrediente;
};
