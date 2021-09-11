const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const CartItem = sequelize.define('cart_item', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  cartId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'cart_id'
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'product_id'
  },
  quantity: Sequelize.INTEGER
})

module.exports = CartItem