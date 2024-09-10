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
  }, {
    sequelize,
    modelName: 'Usuario',
  });

  return Usuario;
};
