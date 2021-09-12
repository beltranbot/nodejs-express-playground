const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        hasProducts: products.length > 0,
        path: '/products',
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
          pageTitle: product.title
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        hasProducts: products.length > 0,
        path: '/'
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products
      })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  req.user.getCart().then(cart => {
    cart.getProducts({ where: {id: productId}})
    .then(products => {
      const product = products[0]
      return product.cart_item.destroy()
    })
    .then(result => {
      return res.redirect('/cart')
    })
  }).catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  let products
  let fetchedCart
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(cartProducts => {
      products = cartProducts
      return req.user.createOrder({ userId: req.user.id })
    })
    .then(order => {
      return order.addProducts(products.map(product => {
        product.order_item = {
          orderId: order.id,
          quantity: product.cart_item.quantity
        }
        return product
      }))
    })
    .then(() => {
      return fetchedCart.setProducts(null)
    })
    .then(() => {
      return res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] })
  .then(orders => {
    return res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders
    })
  })
  .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}
