const { ObjectID } = require('bson')
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
    const cartProductIndex = this.cart.items.findIndex(cartProduct => {
      return cartProduct.productId.toString() === product._id.toString()
    })
    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity })
    }
    const updatedCart = { items: updatedCartItems }
    const db = getDb()
    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    )
  }

  getCart() {
    const db = getDb()
    const productIds = this.cart.items.map(product => product.productId)
    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.
        map(product => {
          const quantity = this.cart.items.find(i => {
            return i.productId.toString() === product._id.toString()
          }).quantity
          return {...product, quantity }
        })
      })
      .catch(err => console.log(err))
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString()
    })
    const db = getDb()
    return db
      .collection('users')
      .updateOne(
        { _id: new Object(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .catch(err => console.log(err))
  }

  addOrder() {
    const db = getDb()
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            username: this.username
          }
        }
        return db.collection('orders')
          .insertOne(order)
      })
      .then(result => {
        this.cart = { items: [] }
        return db.collection('users')
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          )
      })
      .catch(err => console.log(err))
  }

  getOrders() {
    const db = getDb()
    return db.collection('orders')
      .find({ 'user._id': new ObjectID(this._id) })
      .toArray()
  }

  static findById(id) {
    const db = getDb()
    return db.collection('users')
      .findOne({ _id: new ObjectId(id) })
      .catch(err => console.log(err))
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('users')
      .find()
      .toArray()
      .catch(err => console.log(err))
  }
}

module.exports = User;
