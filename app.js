const express = require('express')
const path = require('path')
const expressHbs = require('express-handlebars')

const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const notFoundRoutes = require('./routes/not_found')

const app = express()
// setting up template engine
// app.engine('handlebars', expressHbs()) // sets template engine
var handlebars = expressHbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views"),
  extname: 'handlebars'
});
app.engine('handlebars', handlebars)
// app.set('view engine', 'pug')
app.set('view engine', 'handlebars')
app.set('views', 'views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.router)
app.use(shopRoutes)
app.use(notFoundRoutes)

app.listen(3000)
