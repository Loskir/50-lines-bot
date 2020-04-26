const mongoose = require('mongoose')

const users = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true,
    index: true,
  },

  username: String,
  first_name: String,
  last_name: String,
  language_code: String,

  is_disabled: {
    type: Boolean,
    default: true
  },

  created_at: Date,
  updated_at: Date,
})
users.pre('save', function (next) {
  if (this.created_at === undefined) {
    this.created_at = new Date()
  }
  this.updated_at = new Date()
  return next()
})

module.exports = mongoose.model('users', users)
