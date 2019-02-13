'use strict'
var express = require('express')
var winston = require('../config/winston')(__filename.slice(__dirname.length + 1, -3))
var router = express.Router()
var Motd = require('../models/motd.model')
var Student = require('../models/student.model')
var Parent = require('../models/parent.model')
var Signrecord = require('../models/signrecord.model')

router.post('/getStudents', (req, res) => {
  var passcode = req.body.passcode
  Parent.findOne({ passcode: passcode }).then(parent => {
    if (!parent) {
      winston.info('Invalid passcode: ' + passcode)
      res.json({ error: 'wrong passcode' })
    } else {
      Student.find({ parents: parent }).then(students => {
        res.json({ students: students })
      })
    }
  }).catch(err => {
    winston.error('/getStudents ' + JSON.stringify(err))
    res.json({ success: false, error: err.toString() })
  })
})

router.post('/signoutStudent', (req, res) => {
  var passcode = req.body.passcode
  var studentid = req.body.studentid

  winston.info('Passcode: ' + passcode + ' SutdentId: ' + studentid)

  Parent.findOne({ passcode: passcode }).then(parent => {
    Student.findById(studentid).then(student => {
      student.lastsignout = new Date()
      winston.info('Signed out student: ' + student.firstname + ' ' + student.lastname + ' by parent ' + parent.firstname + ' ' + parent.lastname)
      student.save()
    })

    var date = new Date()
    Signrecord.findOneAndUpdate(
      { student: studentid, date: { year: date.getFullYear(), month: date.getMonth() }},
      { $addToSet: { records: { parent: parent, type: 'out', ip: req.ip }}},
      { upsert: true, setDefaultsOnInsert: true })
      .then(() => {
        res.json({ success: true })
      })
  }).catch(err => {
    winston.error('/signoutStudent ' + JSON.stringify(err))
    res.json({ success: false, error: err.toString() })
  })
})

router.get('/motd', (req, res) => {
  Motd.findOne().then(motd => {
    res.json({ motd: motd.message })
  }).catch(err => {
    winston.error('/motd ' + JSON.stringify(err))
    res.json({ motd: err.toString() })
  })
})

module.exports = router
