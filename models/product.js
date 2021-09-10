const { Sequelize } = require('sequelize')

const sequelize = require('../util/database')

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: true,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'image_url'
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Product
