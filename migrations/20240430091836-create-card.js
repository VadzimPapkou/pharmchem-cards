'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      formula: {
        type: Sequelize.TEXT
      },
      lesson: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      mechanism: {
        type: Sequelize.STRING
      },
      pharmacology: {
        type: Sequelize.STRING
      },
      derivate: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cards');
  }
};