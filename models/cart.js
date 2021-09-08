const fs = require('fs')
const path = require('path')

const filePath = path.join(path.dirname(require.main.filename), 'data', 'cart.json')

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty = updatedProduct.qty + 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice
      fs.writeFile(filePath, JSON.stringify(cart), err => {
        if (err) {
          console.log(err)
        }
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        console.log(err)
        return
      }
      const cart = JSON.parse(fileContent)
      const updatedCart = { ...cart }
      const product = updatedCart.products.find(product => product.id === id)
      if (!product) {
        return
      }
      const productQty = product.qty
      updatedCart.products = updatedCart.products.filter(product => product.id !== id)
      updatedCart.totalPrice = productPrice - (productPrice * productQty)
      fs.writeFile(filePath, JSON.stringify(updatedCart), err => {
        if (err) {
          console.log(err)
        }
      })
    })
  }

  static getCart(cb) {
    fs.readFile(filePath, (err, fileContent) => {
      const cart = JSON.parse(fileContent)
      if (err) {
        return cb(null)
      }
      cb(cart)
    })
  }
}
