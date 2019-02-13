const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  grade: Number,
  birthday: Date,
  parents: [{ type: Schema.Types.ObjectId, ref: 'Parent' }],
  classes: [{ type: String }],
  lastsignout: Date
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

studentSchema.virtual('signout').get(function() {
  return ((new Date() - this.lastsignout) < 5 * 60 * 1000)
})

module.exports = mongoose.model('Student', studentSchema)
