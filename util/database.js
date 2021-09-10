const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('nodejs', 'nodejs', 'nodejs', {
  dialect: 'mysql',
  host: 'db'
})

module.exports = sequelize
