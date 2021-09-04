const express = require('express')
const path = require('path')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const notFoundRoutes = require('./routes/not_found')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(notFoundRoutes)

app.listen(3000)
