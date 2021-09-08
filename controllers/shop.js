const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'Shop',
        hasProducts: rows.length > 0,
        path: '/products',
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findById(productId)
    .then(([results]) => {
        const product = results[0]
        res.render('shop/product-detail', {
          product,
          path: "/products",
          pageTitle: product.title
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        hasProducts: rows.length > 0,
        path: '/'
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = []
      for (const product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id)
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty })
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      })
    })
  })
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price)
  })
  res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price)
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}
