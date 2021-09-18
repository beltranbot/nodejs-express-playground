const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const path = require('path')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const User = require('./models/user')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const errorRoutes = require('./routes/error')
const MONGO_DB_URI = 'mongodb://nodejs:nodejs@mongo:27017'

const app = express()
const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  collection: 'sessions',
  databaseName: 'shop'
})
const csrfProtection = csrf()

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
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next()
      }
      req.user = user
      return next()
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorRoutes)

// error middleware
app.use((error, req, res, next) => {
  res.redirect('/500')
})

const startApp = () => {
  mongoose.connect(MONGO_DB_URI, { dbName: 'shop' })
  .then(result => {
    console.log('connected to db')
    console.log('listening to port 3000')
    app.listen(3000)
  })
  .catch(err => {
    console.log("Failed to connect to db, retrying in 10 seconds...");
    setTimeout(startApp, 10000);
  })
}

startApp();
