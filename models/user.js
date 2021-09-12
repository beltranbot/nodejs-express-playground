const { ObjectId } = require('mongodb')
const { getDb } = require('../util/database')

class User {
  constructor(username, email, cart, id) {
    this.username = username
    this.email = email
    this.cart = cart
    this._id = id
  }

  save() {
    const db = getDb()
    return db.collection('users')
      .insertOne(this)
      .catch(err => console.log(err))
  }

  addToCart(product) {
    const updatedCart = { item: [{ productId: new ObjectId(product._id), quantity: 1 }]
  }
  const db = getDb()
    return db.collection('users').updateOne(
    { _id: new ObjectId(this._id) },
    { $set: { cart: updatedCart } }
  )
  }

  static findById(id) {
  const db = getDb()
  return db.collection('users')
    .findOne({ _id: new ObjectId(id) })
    .catch(err => console.log(err))
}
}

module.exports = User;
