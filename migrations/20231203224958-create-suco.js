// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Sucos', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       nome: {
//         type: Sequelize.STRING
//       },
//       ingredientes: {
//         type: Sequelize.STRING
//       },
//       modo_de_preparo: {
//         type: Sequelize.STRING
//       },
//       beneficios: {
//         type: Sequelize.STRING
//       },
//       img1: {
//         type: Sequelize.STRING
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Sucos');
//   }
// };