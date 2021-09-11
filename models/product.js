const mongodb = require('mongodb')
const { getDb } = require('../util/database')

class Product {
  constructor(title, description, imageUrl, price) {
    this.title = title
    this.description = description
    this.imageUrl = imageUrl
    this.price = price
  }

  save() {
    const db = getDb()
    return db.collection('products')
      .insertOne(this)
      .catch(err => console.log(err))
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products')
      .find()
      .toArray()
      .catch(err => console.log(err))
  }

  static findById(id) {
    const db = getDb()
    return db.collection('products')
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .catch(err => console.log(err))
  }
}

module.exports = Product
