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
  const product = new Product(title, description, imageUrl, description)
  product.save()
    .then(() => {
      res.redirect('/admin/products')
    }).catch(err => console.log(err))
}

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit
//   if (!editMode) {
//     return res.redirect('/')
//   }
//   const productId = req.params.productId
//   req.user.getProducts({where: {id: productId}})
//     .then(products => {
//       if (!products) {
//         return res.redirect('/')
//       }
//       res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product: products[0]
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.postEditProduct = (req, res, next) => {
//   const productId = req.body.productId
//   const title = req.body.title
//   const price = req.body.price
//   const description = req.body.description
//   const imageUrl = req.body.imageUrl
//   Product.findByPk(productId)
//     .then(product => product.update({
//       title,
//       price,
//       description,
//       imageUrl
//     }))
//     .then(() => res.redirect('/admin/edit-product/' + productId + '?edit=true'))
//     .catch(err => console.log(err))
// }

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch(err => console.log(err))
}

// exports.deleteProduct = (req, res, next) => {
//   const productId = req.body.productId
//   Product.findByPk(productId)
//     .then(product => product.destroy())
//     .then(() => res.redirect('/admin/products'))
//     .catch(err => console.log(err))
// }
