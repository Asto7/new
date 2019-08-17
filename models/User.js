const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const A=new Schema({title:String,email:String,Amount:String,requestDate:{
//   type: Date,
//   default:null
//
// }});

// create schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  online:{
    type: String,
    default: 'false'

  }
});

mongoose.model('users', UserSchema);
