const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findByPk(productId)
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
  Product.findAll()
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
    .then(cart => {
      return cart.getProducts()
    })
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
  let fetchedCart
  let newQuantity = 1
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      let product
      if (products.length > 0) {
        product = products[0]
      }
      if (product) {
        const oldQuantity = product.cart_item.quantity;
        newQuantity = oldQuantity + 1
        return product
      }
      return Product.findByPk(productId)
    })
    .then(product => {
      return fetchedCart.addProduct(
        product, {
          through: {
            cartId: fetchedCart.id,
            productId: product.id,
            quantity: newQuantity
          }
        })
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findByPk(productId, product => {
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
