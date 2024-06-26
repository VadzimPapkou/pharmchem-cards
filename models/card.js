'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Card.init({
    formula: DataTypes.TEXT,
    name: DataTypes.STRING,
    mechanism: DataTypes.STRING,
    pharmacology: DataTypes.STRING,
    lesson: DataTypes.STRING,
    derivate: DataTypes.STRING,
    quantification: DataTypes.STRING,
    identification: DataTypes.STRING,
    tradename: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Card',
    timestamps: false
  });
  return Card;
};