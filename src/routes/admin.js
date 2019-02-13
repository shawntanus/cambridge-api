'use strict'
var express = require('express')
var router = express.Router()
var Motd = require('../models/motd.model')
var Student = require('../models/student.model')
var Parent = require('../models/parent.model')
var Signrecord = require('../models/signrecord.model')

// var log = require('debug')('admin')

function generalProcess(req, res, query) {
  query.then(data => {
    res.json(data)
  }).catch(err => {
    res.statusCode = 400
    console.log(err)
    if (err.code === 11000) {
      res.json(err)
    } else {
      res.json(err.toString())
    }
  })
}

/* Motd */
router.get('/motd', (req, res) => {
  generalProcess(req, res,
    Motd.findOne())
})

router.put('/motd/:id', (req, res) => {
  generalProcess(req, res,
    Motd.findByIdAndUpdate({ _id: req.params.id }, req.body))
})

/* Student */
router.get('/student/list', (req, res) => {
  generalProcess(req, res,
    Student.find())
})

router.get('/student/list/grade/:grade', (req, res) => {
  generalProcess(req, res,
    Student.find({ grade: req.params.grade }).populate('parents'))
})

router.get('/student/count/grade', (req, res) => {
  generalProcess(req, res,
    Student.aggregate([
      { $group: { _id: '$grade', count: { $sum: 1 }}}]
    ))
})

router.get('/student/list/forSearch', (req, res) => {
  generalProcess(req, res,
    Student.aggregate().project({
      value: { $concat: ['$firstname', ' ', '$lastname'] },
      parents: 1,
      lastname: 1
    }))
})

router.get('/student/:id', (req, res) => {
  generalProcess(req, res,
    Student.findById(req.params.id))
})

router.put('/student/:id', (req, res) => {
  generalProcess(req, res,
    Student.findByIdAndUpdate(req.params.id, req.body, { new: true }))
})

router.post('/student', (req, res) => {
  const student = new Student(req.body)
  generalProcess(req, res,
    student.save())
})

/* Parent */
router.get('/parent/:id', (req, res) => {
  generalProcess(req, res,
    Parent.findById(req.params.id))
})

router.put('/parent/:id', (req, res) => {
  generalProcess(req, res,
    Parent.findByIdAndUpdate(req.params.id, req.body, { new: true }))
})

router.post('/parent', (req, res) => {
  const parent = new Parent(req.body)
  generalProcess(req, res,
    parent.save())
})

/* Signrecord */
router.get('/signrecord/:studentid/:year/:month', (req, res) => {
  generalProcess(req, res,
    Signrecord.findOne({ student: req.params.studentid, 'date.year': req.params.year, 'date.month': req.params.month }))
})

module.exports = router
