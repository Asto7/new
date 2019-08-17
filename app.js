// server start: nodemon app.js
// mongodb start (form workspace folder): ../mongostart
const handle=require('handlebars');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');
const socket=require('socket.io');
// load routes
const peer = require('./routes/peer');
const users = require('./routes/users').a;
let clients=0;
// passport config
require('./config/passport')(passport);


require('./models/back');
const chatbox = mongoose.model('BACK');


// db config
const db = require('./config/database');
// var url='mongodb+srv://Asto7:Hello@survey-k6sbs.mongodb.net/test?retryWrites=true&w=majority';
// connect to mongoose
var url='mongodb://localhost:27017/KIRA';
mongoose.connect(url,
{useNewUrlParser: true}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.log(err);
});

handle.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'

}));
app.set('view engine', 'handlebars');

handle.registerHelper('TRY',function(x){
  if(x==0)
  return('CHECKED');
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override
app.use(methodOverride('_method'));

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true

}));

// adding passport middleware
// it is very important to add this after the express session
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg'); // needed for flash to work
  res.locals.error_msg = req.flash('error_msg');     // needed for flash to work
  res.locals.error = req.flash('error');             // needed for flash to work
  res.locals.user = req.user || null;                // needed for passport login/logout to work
  next();
})

app.get('/', (req, res) => {
    const title='Welcome to Asto Chat!';
    res.render('index', {
       title: title
   });
});

app.get('/about', (req,res) => {
   res.render('about');
});



// use routes
app.use('/users', users);
app.use('/peer',peer);

const port = process.env.PORT||4000;

var server=app.listen(port, () => {
   console.log(`listening on port ${port}`);
});

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {
 socket.join('just');
    console.log('made socket connection', clients);
socket.on('saveText',function(data){
io.sockets.in('just').emit('finalAdd', data);
// io.sockets.emit('finalAdd',data);
});

    // Handle chat event
    socket.on('chat', function(data){
      console.log(data);
      // console.log(data.handle);
      io.sockets.in('just').emit('chat', data);
        // io.sockets.emit('chat', data);
    });

    // Handle typing event

    socket.on('typing', function(data){
        // socket.broadcast.emit('typing', data);
        socket.broadcast.to('just').emit('typing', data);

    });

    socket.on('request',function(data){
      // socket.broadcast.emit('response', data);
      socket.broadcast.to('just').emit('response', data);

    });

      socket.on('Decline',function(data){
            // socket.broadcast.emit('decline', data);
            socket.broadcast.to('just').emit('decline', data);

    });

      socket.on('accept',function(data){
        // io.sockets.emit('videochat', data);
        io.sockets.in('just').emit('videochat', data);

    });

socket.on('over',function(){
  // io.sockets.emit('overend');
  io.sockets.in('just').emit('overend');

  });

    socket.on("NewClient", function (data) {
      this.emit('CreatePeer')
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)

});


function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
      this.broadcast.to('just').emit('Disconnect');
            // this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
  this.broadcast.to('just').emit('BackOffer',offer);
      // this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
  this.broadcast.to('just').emit('BackAnswer',data);
    // this.broadcast.emit("BackAnswer", data)
}
