const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  let errors = req.flash('error')
  errors = errors.length > 0 ? { error: { msg: errors[0] } } : null;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
    errors
  })
}

exports.getSignup = (req, res, next) => {
  let error = req.flash('error')
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errors: error.length > 0 ? error : null,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: req.session.isLoggedIn,
      errors: errors.mapped()
    })
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      }
      return bcrypt.compare(password, user.password)
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
          return res.redirect('/login')
        })
    })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Sigup',
      errors: errors.mapped(),
      oldInput: { email, password, confirmPassword }
    })
  }
  bcrypt.hash(password, 12)
    .then(password => {
      const user = new User({
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
