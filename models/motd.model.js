const mongoose = require('mongoose')
const Schema = mongoose.Schema

const motdSchema = new Schema({
  message: { type: String, required: true }
})

module.exports = mongoose.model('motd', motdSchema)
