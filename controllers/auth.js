const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.postLogin = (req, res, next) => {
  User.findOne()
    .then(user => {
      if (!user) {
        let user = new User({
          username: 'admin',
          email: 'admin@example.com',
          cart: {
            items: []
          }
        })
        return user.save()
      }
      return user
    })
    .then(user => {
      req.session.isLoggedIn = true
      req.session.user = user
      res.redirect('/')
    })
    .catch(err => console.log(err))
}
