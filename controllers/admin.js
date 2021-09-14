const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: req.session.user
  })
  product.save()
    .then(() => {
      res.redirect('/admin/products')
    }).catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const productId = req.params.productId
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        isAuthenticated: req.session.isLoggedIn
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
  Product.findById(productId)
    .then(product => {
      product.title = title
      product.price = price
      product.description = description
      product.imageUrl = imageUrl
      return product.save()
    })
    .then(() => res.redirect('/admin/edit-product/' + productId + '?edit=true'))
    .catch(err => console.log(err))

}

exports.getProducts = (req, res, next) => {
  Product.find()
    .populate('userId')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findByIdAndDelete(productId)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err))
}
