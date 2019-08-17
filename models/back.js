const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create schema
const fmSchema = new Schema({
  chat: {
    type: String,
    required: true
  },
    user: {
    type: String,
    required: true
  },
  mate:{
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },

});

mongoose.model('BACK', fmSchema);
