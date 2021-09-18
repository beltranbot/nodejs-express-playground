const express = require('express')
const { body } = require('express-validator')

const adminController = require('../controllers/admin')

const isAuth = require('../middleware/is-auth')

const router = express.Router()

const validCharacters = /^[a-zA-Z0-9\s\(\)\-\.\:]*$/
const productValidations = [
  body('title')
    .matches(validCharacters)
    .isLength({ min: 3 })
    .trim(),
  body('imageUrl')
    .isURL(),
  body('price')
    .isFloat(),
  body('description')
    .isLength({ min: 5, max: 400})
    .trim()
];

router.get('/add-product', isAuth, adminController.getAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post(
  '/edit-product',
  isAuth,
  productValidations,
  adminController.postEditProduct
)

router.get('/products', isAuth, adminController.getProducts)

router.post(
  '/products',
  isAuth,
  productValidations,
  adminController.postAddProduct
)

router.post('/delete-product', isAuth, adminController.deleteProduct)

module.exports = router
