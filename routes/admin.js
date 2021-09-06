const express = require('express')

const productsController = require('../controllers/products')

const router = express.Router()

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct)

// /admin/product => POST
router.post('/product', productsController.postAddProduct)

module.exports = router
