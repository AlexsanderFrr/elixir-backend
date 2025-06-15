'use strict';
//const bcrypt = require('bcrypt');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Defina as associações aqui, se houver
    }
  }

 Usuario.init({
  nome: DataTypes.STRING,
  email: DataTypes.STRING,
  senha: DataTypes.STRING,
  imagem: DataTypes.STRING,
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    type: DataTypes.ENUM("comum", "admin"),
    defaultValue: "comum"
  }
}, {
  sequelize,
  modelName: 'Usuario',
});


  return Usuario;
};
