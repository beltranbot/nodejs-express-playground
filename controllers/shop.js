const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        hasProducts: products.length > 0,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findById(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        path: "/products",
        pageTitle: product.title,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        hasProducts: products.length > 0,
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .then(user => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  Product.findById(productId)
    .then(product => {
      return req.session.user.addToCart(product)
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  req.session.user
    .removeFromCart(productId)
    .then(result => {
      return res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(product => {
        return {
          quantity: product.quantity,
          product: { ...product.productId._doc }
        }
      })
      const order = new Order({
        user: {
          username: req.session.user.username,
          userId: req.session.user
        },
        products
      })
      return order.save()
    })
    .then(() => {
      return req.session.user.clearCart()
    })
    .then(() => {
      return res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then(orders => {
      return res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: req.session.isLoggedIn
  })
}
