const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  })
}

exports.postLogin = (req, res, next) => {
  User.findOne()
    .then(user => {
      if (!user) {
        user = new User({
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
      req.session.save(err => {
        if (err) {
          console.log(err)
        }
        res.redirect('/')
      })
    })
    .catch(err => console.log(err))
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.redirect('/')
      }
      user = new User({
        email,
        password,
        cart: { items: [] }
      })
      return user.save()
    })
    .then(user => {
      res.redirect('/')
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
}
