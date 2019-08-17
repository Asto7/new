const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('users');



module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) { // because of passport
      req.user.online='true';
      req.user.save().then().catch(err=>console.log(err))

return next();
    }
    req.flash('error_msg', 'Not authorized');
    res.redirect('/users/login');
  }
}
