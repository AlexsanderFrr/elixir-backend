'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // define association here
    }
  }

  Usuario.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: {
      type: DataTypes.STRING,
      set(value) {
        const hashedPwd = bcrypt.hashSync(value,
          bcrypt.genSaltSync(10));
          this.setDataValue('senha', hashedPwd);
      },
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};