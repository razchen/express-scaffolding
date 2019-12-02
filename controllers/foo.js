const { promisify } = require('util')
const passport = require('passport')
const _ = require('lodash')
const validator = require('validator')
const User = require('../models/User')

/**
 * GET /users
 * Users Index
 */
exports.index = (req, res, next) => {
  User.find({})
    .exec()
    .then(docs => {
      res.status(200).json(docs)
    })
    .catch(err => {
      console.log(err)
      return next(err)
    })
}

/**
 * GET /users/:id
 * Users Show
 */
exports.show = (req, res, next) => {
  User.findById(req.params.id)
    .exec()
    .then(doc => {
      res.status(200).json(doc)
    })
    .catch(err => {
      console.log(err)
      return next(err)
    })
}

/**
 * PATCH /users/:id
 * Users Update
 */
exports.show = (req, res, next) => {
  User.update({ id: req.params.id }, res.params)
    .exec()
    .then(doc => {
      res.status(200).json(doc)
    })
    .catch(err => {
      console.log(err)
      return next(err)
    })
}

/**
 * DELETE /users/:id
 * Users Delete
 */
exports.delete = (req, res, next) => {
  User.findByIdAndRemove(req.params.id, (err, users) => {
    if (err) return res.status(500).send(err)
    const response = {
      message: 'User successfully deleted',
      id: req.params.id
    }
    return res.status(200).send(response)
  })
}

/**
 * PUT /users/:id
 * Users Store
 */
exports.store = (req, res, next) => {
  User.create(req.body)
    .then(doc => {
      res.status(200).json({
        doc
      })
    })
    .catch(err => {
      console.log(err)
      return next(err)
    })
}

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  const validationErrors = []
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: 'Please enter a valid email address.' })
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: 'Password cannot be blank.' })

  if (validationErrors.length) {
    req.flash('errors', validationErrors)
    return res.redirect('/login')
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false
  })

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      req.flash('errors', info)
      return res.redirect('/login')
    }
    req.logIn(user, err => {
      if (err) {
        return next(err)
      }
      req.flash('success', { msg: 'Success! You are logged in.' })
      res.redirect(req.session.returnTo || '/')
    })
  })(req, res, next)
}
