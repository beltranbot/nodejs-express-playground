const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const OrderItem = sequelize.define('order_item', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  orderId: {
    type: Sequelize.INTEGER,
    field: 'order_id',
    allowNull: false
  },
  productId: {
    type: Sequelize.INTEGER,
    field: 'product_id',
    allowNull: false
  },
  quantity: Sequelize.INTEGER
})

module.exports = OrderItem
