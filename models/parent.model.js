const mongoose = require('mongoose')
const Schema = mongoose.Schema

const parentSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  cellphone: { type: String },
  passcode: { type: String, index: { unique: true }}
})

module.exports = mongoose.model('Parent', parentSchema)
