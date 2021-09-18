const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  let error = req.flash('error')
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: error.length > 0 ? error : null
  })
}

exports.getSignup = (req, res, next) => {
  let error = req.flash('error')
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: error.length > 0 ? error : null
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
      .then(result => {
        if (result) {
          req.session.isLoggedIn = true
          req.session.user = user
          req.user = user
          return req.session.save(err => {
            if (err) {
              console.log(err)
            }
            return res.redirect('/')
          })
        }
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      })
      .catch(err => {
        console.log(err)
        return res.redirect('login')
      })
    })
    .catch(err => console.log(err))
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Sigup',
      errorMessage: errors.array()[0].msg
    })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        req.flash('error', 'Email already registered.')
        return res.redirect('/signup')
      }
      return bcrypt.hash(password, 12)
      .then(password => {
        const user = new User({
          email,
          password,
          cart: { items: [] }
        })
        return user.save()
      })
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
