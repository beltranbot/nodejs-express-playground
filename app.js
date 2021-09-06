const express = require('express')
const path = require('path')

const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const notFoundRoutes = require('./routes/not_found')

const app = express()
// setting up template engine
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.router)
app.use(shopRoutes)
app.use(notFoundRoutes)

app.listen(3000)
