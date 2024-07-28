// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('AllInformations', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       fk_suco: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: { model: "sucos", key: "id" },
//         onDelete: "CASCADE",
//       },
//       fk_ingredientes: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: { model: "ingredientes", key: "id" },
//         onDelete: "CASCADE",
//       },
//       fk_diagnostico: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: { model: "diagnosticos", key: "id" },
//         onDelete: "CASCADE",
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
//     await queryInterface.dropTable('AllInformations');
//   }
// };