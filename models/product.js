const fs = require('fs')
const path = require('path')

const filePath = path.join(path.dirname(require.main.filename), 'data', 'products.json')

const getProductsFromFile = callback => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      return callback([])
    }
    callback(JSON.parse(fileContent))
  })
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex((product) => {
          return product.id === this.id
        })
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this
        fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {
          if (err) {
            console.log(err)
          }
        })
        return
      }
      this.id = Math.random().toString()
      products.push(this)
      fs.writeFile(filePath, JSON.stringify(products), err => {
        if (err) {
          console.log(err)
        }
      })
    })
  }

  static fetchAll(callback) {
    getProductsFromFile(callback)
  }

  static findById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id)
      callback(product)
    })
  }
}
