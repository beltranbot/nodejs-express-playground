const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price)
  product.save()
    .then(() => {
      res.redirect('/')
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const productId = req.params.productId
  Product.findById(productId)
    .then(([rows]) => {
      if (rows.length !== 1) {
        return res.redirect('/')
      }
      const product = rows[0]
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  const product = new Product(productId, title, imageUrl, description, price)
  product.save()
  res.redirect('/admin/edit-product/' + productId + '?edit=true')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render('admin/products', {
        prods: rows,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch(err => console.log(err))
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.deleteById(productId)
  res.redirect('/admin/products')
}
