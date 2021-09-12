const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const adminRoutes = require('./routes/admin')
// const shopRoutes = require('./routes/shop')
const errorRoutes = require('./routes/error')
// const User = require('./models/user')

const app = express()

// setting up template engine
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//   User.fetchAll()
//     .then(users => {
//       if (users.length === 1) {
//         let user = users[0]
//         req.user = new User(user.username, user.email, user.cart, user._id)
//         return next()
//       }
//       const user = new User("admin", "admin@example.com", [], null)
//       user.save()
//         .then(user => {
//           req.user = user
//           next()
//         })
//         .catch(err => console.log(err))
//     })
//     .catch(err => console.log(err))
// })

app.use('/admin', adminRoutes)
// app.use(shopRoutes)
app.use(errorRoutes)

mongoose.connect('mongodb://nodejs:nodejs@mongo:27017', { dbName: 'shop' })
  .then(result => {
    console.log('connected to db')
    app.listen(3000)
  })
  .catch(err => console.log(err))
