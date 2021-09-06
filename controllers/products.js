const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCss: true,
    productCss: true,
    activateAddProduct: true
  })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title)
  product.save()
  return res.redirect('/')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      docTitle: 'Shop',
      hasProducts: products.length > 0,
      path: '/',
      activeShop: true,
      productCss: true
    })
  })
}
