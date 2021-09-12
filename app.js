const express = require('express')
const path = require('path')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorRoutes = require('./routes/error')
const User = require('./models/user')
const { mongoConnect } = require('./util/database')

const app = express()

// setting up template engine
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById('613d276411abee55436eb951')
    .then(user => {
      if (user) {
        req.user = new User(user.username, user.email, user.cart, user._id)
      }
      next()
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorRoutes)

mongoConnect(() => {
  console.log('connected to db')
  app.listen(3000)
})
