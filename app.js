const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const path = require('path')
const MongoDBStore = require('connect-mongodb-session')(session)

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const errorRoutes = require('./routes/error')
const User = require('./models/user')
const MONGO_DB_URI = 'mongodb://nodejs:nodejs@mongo:27017'

const app = express()
const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  collection: 'sessions',
  databaseName: 'shop'
})

// setting up template engine
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store
}))

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (user) {
        req.user = user
      }
      return next()
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorRoutes)

mongoose.connect(MONGO_DB_URI, { dbName: 'shop' })
  .then(result => {
    console.log('connected to db')
    app.listen(3000)
  })
  .catch(err => console.log(err))
