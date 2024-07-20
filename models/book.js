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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notNull:{
              msg: "This book needs a title. You're making bookstore employees' lives more difficult."
          },
          notEmpty: {
              msg: "This book needs a title. You're making bookstore employees' lives more difficult."
          }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notNull:{
              msg: "Who wrote this book? Yeah, I don't know either. We'll never know until you add an author."
          },
          notEmpty: {
              msg: "Who wrote this book? Yeah, I don't know either. We'll never know until you add an author."
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