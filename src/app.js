'use strict'
const express = require('express')
const morgan = require('morgan')
const winston = require('./config/winston')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const signoutRouter = require('./routes/signout')
const adminRouter = require('./routes/admin')

var app = express()

var env = process.env.NODE_ENV || 'development'
if (env === 'development') {
  const cors = require('cors')
  app.use(cors())
  mongoose.connect('mongodb://localhost:27017/cambridge', { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
  // mongoose.set('debug', true)
  // mongoose.set('debug', function (coll, method, query, doc) {
  //   console.log(coll, method, query, doc)
  //  })
} else {
  mongoose.connect('mongodb://mongo:27017/cambridge', { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
}

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

// app.use(morgan('combined'))
app.use(morgan('combined', { stream: winston('access').stream }))
app.use(bodyParser.json())
app.use('/api/signout', signoutRouter)
app.use('/api/admin', adminRouter)

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
