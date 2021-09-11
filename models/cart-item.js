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
    field: 'cart_id',
    allowNull: false
  },
  productId: {
    type: Sequelize.INTEGER,
    field: 'product_id',
    allowNull: false
  },
  quantity: Sequelize.INTEGER
})

module.exports = CartItem