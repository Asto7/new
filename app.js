var express=require('express');
var port=process.env.PORT||9000;
var app=express();

app.use(express.static('./public'));
app.get('/',function(req,res){
  res.redirect('./public/index.html');
})
app.listen(port);
