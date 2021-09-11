const mongodb = require('mongodb')
const { getDb } = require('../util/database')

class Product {
  constructor(title, imageUrl, price, description, id) {
    this.title = title
    this.imageUrl = imageUrl
    this.price = price
    this.description = description
    this._id = id ? new mongodb.ObjectId(id) : null
  }

  save() {
    const db = getDb()
    if (this._id) {
      return db.collection('products')
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: this } // mongo automatically maps this class' fields to the document to be update
        )
        .catch(err => console.log(err))
    }
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

  static deleteById(id) {
    const db = getDb()
    return db.collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .catch(err => console.log(err))
  }
}

module.exports = Product
