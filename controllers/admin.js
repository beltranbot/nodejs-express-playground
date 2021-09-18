const Product = require('../models/product')
const { validationResult } = require('express-validator')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errors: {},
    isAuthenticated: req.session.isLoggedIn,
    validationErrors: []
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      errors: errors.mapped(),
      hasError: true,
      validationErrors: errors.array(),
      product: { title, imageUrl, price, description },
    })
  }
  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: req.session.user
  })
  return product.save()
    .then(() => {
      res.redirect('/admin/products')
    }).catch(err => {
      const error = new Error(errr)
      error.httpStatusCode = 500
      next(error)
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const productId = req.params.productId
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        errors: {},
        product,
        isAuthenticated: req.session.isLoggedIn,
        hasError: false,
        validationErrors: []
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      errors: errors.mapped(),
      product: {
        title,
        price,
        description,
        imageUrl,
        _id: productId
      },
      isAuthenticated: req.session.isLoggedIn,
      hasError: true,
      validationErrors: errors.array()
    })
  }
  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/')
      }
      product.title = title
      product.price = price
      product.description = description
      product.imageUrl = imageUrl
      return product.save()
        .then(() => res.redirect('/admin/edit-product/' + productId + '?edit=true'))
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .populate('userId')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect('/admin/products'))
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}
