'use strict'
var express = require('express')
var router = express.Router()
var Motd = require('../models/motd.model')
var Student = require('../models/student.model')
var Parent = require('../models/parent.model')
var Signrecord = require('../models/signrecord.model')

var log = require('debug')('signout')

router.post('/getStudents', (req, res) => {
    var passcode = req.body.passcode
    Parent.findOne({ passcode: passcode }).then(parent => {
        if (!parent) {
            log('Invalid passcode', passcode)
            res.json({ error: 'wrong passcode' })
        } else {
            Student.find({ parents: parent }, (err, students) => {
                res.json({ students: students })
            })
        }
    }).catch(err => {
        console.error(err)
        res.json({ success: false, error: err.toString() })
    })
})

router.post('/signoutStudent', (req, res) => {
    var passcode = req.body.passcode
    var studentid = req.body.studentid
    console.log('Passcode:', passcode, 'StudentId', studentid)

    Parent.findOne({ passcode: passcode }).then(parent => {
        Student.findById(studentid).then(student => {
            student.lastsignout = new Date()
            student.save()
        })

        var date = new Date()
        Signrecord.findOneAndUpdate(
            { student: studentid, date: { year: date.getFullYear(), month: date.getMonth() } },
            { $addToSet: { records: { parent: parent, type: 'out', ip: req.ip } } },
            { upsert: true, setDefaultsOnInsert: true })
            .then(() => {
                res.json({ success: true })
            })
    }).catch(err => {
        console.error(err)
        res.json({ success: false, error: err.toString() })
    })
})

router.get('/motd', (req, res) => {
    Motd.findOne().then(motd => {
        res.json({ motd: motd.message })
    }).catch(err => {
        console.error(err)
        res.json({ motd: err.toString() })
    })
})

module.exports = router
