const express = require('express')

const router = express.Router()

router.get('/add-product', (req, res, next) => {
  console.log("In another middleware")
  res.send(`<form action="/product" method="POST">
    <input type="text" name="title">
    <button type="submit">submit</button>
  </form>`)
})

router.post('/product', (req, res, next) => {
  console.log(req.body)
  console.log("title:", req.body.title)
  res.redirect('/')
})

module.exports = router
