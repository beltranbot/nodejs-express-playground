const express = require('express')
const { check } = require('express-validator')

const authController = require('../controllers/auth')

const router = express.Router()

router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.post('/logout', authController.postLogout)

router.get('/signup', authController.getSignup)

router.post(
  '/signup',
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
      if (value === 'test@test.com') {
        throw new Error('This email address if fobidden.')
      }
      return true;
    }),
  authController.postSignup
)

router.post('/', authController.postLogout)

module.exports = router
