const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb://nodejs:nodejs@mongo:27017')
  .then(client => {
    _db = client.db('shop')
    return callback(client)
  })
  .catch(err => console.log(err))
}

const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
