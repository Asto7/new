var express=require('express');

var app=express();

app.use(express.static('./public'));
app.get('/',function(req,res){
  res.redirect('./public/index.html');
})
app.listen(9999);
