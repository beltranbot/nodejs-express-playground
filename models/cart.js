const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
}, {
  unique: true,
  fields: ['user_id']
})

module.exports = Cart
