'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'tipo', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'comum'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'tipo');
  }
};

