const express = require('express')
const path = require('path')
const rootDir = require('../util/path')

const router = express.Router()

router.use((req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page Not Found'})
})

module.exports = router
