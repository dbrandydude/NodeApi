const express = require('express')

const Customers = require('../../db/collections').CustomerList
const auth = require('../middlewares').auth

class CustomersRouter {
  constructor () {
    this.router = express.Router()
    this.middleware()
    this.init()
  }

  getAll (req, res, next) {
    let options = {
      order: [['createdAt', 'DESC']],
      limit: req.query.limit || process.env.QUERY_LIMIT
    }
    Promise.all([
      Customers.findAll(options)
    ]).then(results => {
      const customers = results[0]
      res.status(200)
        .send({
          customers,
          status: res.status
        })
    }, err => {
      next(err)
    })
  }

  getOne (req, res, next) {
    Customers.findById(req.params.id)
      .then(result => {
        if (result) {
          const customer = result.dataValues
          res.status(200)
            .send({
              customer,
              status: res.status
            })
        } else {
          res.status(404)
            .send({
              message: 'No customer found with the given id.',
              status: res.status
            })
        }
      })
  }

  createOne (req, res, next) {
    Customers.create(req.body)
      .then(customer => {
        res.status(201)
          .send({
            customer,
            status: res.status
          })
      }, err => {
        next(err)
      })
  }

  updateOne (req, res, next) {
    let options = {
      where: { id: req.params.id }
    }
    Customers.update(req.body, options)
      .then(result => {
        res.sendStatus(200)
      }, err => {
        next(err)
      })
  }

  deleteOne (req, res, next) {
    Customers.findById(req.params.id)
      .then(customer => {
        if (customer) {
          customer.destroy()
          res.sendStatus(200)
        } else {
          res.status(404)
            .send({
              message: 'No customer found with the given id.',
              status: res.status
            })
        }
      })
  }

  middleware () {
    this.router.use(auth)
  }

  init () {
    this.router.get('/', this.getAll)
    this.router.get('/:id', this.getOne)
    this.router.post('/', this.createOne)
    this.router.put('/:id', this.updateOne)
    this.router.delete('/:id', this.deleteOne)
  }
}

const customersRoutes = new CustomersRouter()
customersRoutes.init()

module.exports = customersRoutes.router
