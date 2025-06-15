'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Usuarios', 'tipo', {
    type: Sequelize.ENUM('comum', 'admin'),
    defaultValue: 'comum',
  });
},

down: async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Usuarios', 'tipo');
}
};
