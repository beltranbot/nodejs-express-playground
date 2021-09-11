const express = require('express')
const path = require('path')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorRoutes = require('./routes/error')

const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

const app = express()

// setting up template engine
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      if (user) {
        req.user = user
      }
      next()
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorRoutes)

Product.belongsTo(User, {
  foreignKey: 'user_id',
  constraints: true,
  onDelete: 'CASCADE'
})
User.hasMany(Product, {
  foreignKey: 'user_id'
})
User.hasOne(Cart, {
  foreignKey: 'user_id'
})
Cart.belongsTo(User, {
  foreignKey: 'user_id',
  constraints: true,
  onDelete: 'CASCADE'
})
Cart.belongsToMany(Product, {
  through: CartItem,
  foreignKey: 'product_id',
  otherKey: 'cart_id'
})
Product.belongsToMany(Cart, {
  through: CartItem,
  foreignKey: 'product_id',
  otherKey: 'cart_id'
})

// sequelize.sync({ force: true })
sequelize.sync() // force: true to force recreation
  .then((result) => {
    User.findByPk(1)
      .then(user => {
        if (!user) {
          return User.create({ name: 'carlos', email: 'test@test.com' })
        }
        return Promise.resolve(user)
      })
      .then(user => {
        user.getCart()
          .then(cart => {
            if (!cart) {
              user.createCart()
            }
          })
      })
      .then(() => app.listen(3000))
      .catch(err => console.log(err))
  })
  .catch(err => console.log(err))

