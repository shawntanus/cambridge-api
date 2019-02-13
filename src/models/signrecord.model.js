const mongoose = require('mongoose')
const Schema = mongoose.Schema

var recordSchema = new Schema({
  parent: { type: Schema.Types.ObjectId, ref: 'Parent', required: true },
  time: { type: Date, default: Date.now },
  type: { type: String, required: true },
  ip: String
})

const signrecordSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  date: {
    year: { type: Number, required: true },
    month: { type: Number, required: true }
  },
  records: [recordSchema]
})

module.exports = mongoose.model('Signrecord', signrecordSchema)
