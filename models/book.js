'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notNull:{
              msg: "Hey, this title is null. Not even blank, just null. Fix that!"
          },
          notEmpty: {
              msg: "Please stop being lazy and add a title for your movie!"
          }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notNull:{
              msg: "Hey, this author is null. Not even blank, just null. Fix that!"
          },
          notEmpty: {
              msg: "Please stop being lazy and add a author for your movie!"
          }
      }
      
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};