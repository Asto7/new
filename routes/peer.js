const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// load user model
require('../models/User');
const User = mongoose.model('users');
const {ensureAuthenticated}=require('../helpers/auth');

require('../models/back');
const Back = mongoose.model('BACK');


router.get('/choice',ensureAuthenticated, (req,res) => {
   res.render('choice');
});

router.get('/demo',ensureAuthenticated, (req,res) => {
User.find({}).then(result=>{
var i;
for( i=0;i<result.length;i++)
  {
    if(result[i].email==req.user.email)
    {
      result.splice(i,1);
      break;}
  }
  res.render('home',{user:result,me:req.user});
})
});

router.get('/complete',ensureAuthenticated, (req,res) => {
  req.flash('error_msg', 'This feature is under work now. Will possibly start it soon!.');
  res.redirect('/peer/choice');
});

router.post('/videochat',ensureAuthenticated, (req,res) => {
  console.log(req.body);
   res.render('videochat',{me:req.user.name,mate:req.body.mate});
});

router.get('/visit/:id',ensureAuthenticated, (req,res) => {
  Back.findOne({_id:req.params.id}).sort({creationDate:'descending'}).then(result=>{
console.log(result);
    res.render('view',{chat:result.chat});
  }).catch(err=>console.log(err));
});


router.post('/endcall',ensureAuthenticated, (req,res) => {
  // console.log(req.body);
if(req.body.heavy=='')
req.body.heavy=='<span></span>'
const data={chat:req.body.heavy,user:req.user.name,mate:req.body.mate};
new Back(data).save().then((result)=>{
console.log(result);
  Back.find({user:req.user.name}).sort({creationDate:'descending'}).then(results=>{
    req.flash('success_msg', 'Recording Saved Successfully.');
    res.redirect('/peer/history');
    // res.render('history',{kira:results});
    })
}).catch(err=>console.log(err));

});


router.get('/history',ensureAuthenticated, (req,res) => {

Back.find({user:req.user.name}).sort({creationDate:'descending'}).then(results=>{
  res.render('history',{kira:results});
  })
});

module.exports=router;
