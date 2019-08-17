// <link href="/styles.css" rel="stylesheet" />
var link=document.createElement('link');
// link.href='/style.css';
link.setAttribute('href','/style.css')
link.setAttribute('rel','stylesheet')
document.getElementsByTagName('head')[0].appendChild(link)


// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
if(message.value!= "")
    {
      socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
  }
    message.value = "";
});


function  accept(){
  socket.emit('accept');
}

function Decline(){
var name=document.getElementById('decline');
var value=document.getElementById('name').innerHTML;

var delet=document.getElementsByClassName('request')[0];
delet.parentElement.removeChild(delet);

  socket.emit('Decline',{name:value});
}

function hey()
{event.target.parentElement.parentElement.removeChild(event.target.parentElement);}



message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

socket.on('response', function(data){

var div=document.createElement('div');
div.setAttribute('style','background-color:#e9ecef;');
div.className='alert request';
div.innerHTML='<p>'+'<span id="name" style="color:green;">'+data.name.toUpperCase()+'</span>'+' Wants to have a Video Call.</p><center><a style="color:green;" onclick="accept()" class="btn">Accept</a><a style="color:red;" onclick="Decline()" id="decline" class="btn">Decline</a></center>'
var container=document.getElementsByClassName('container')[0];
container.insertBefore(div,container.children[2]);
});


socket.on('decline', function(data){
  var div=document.createElement('div');
  div.setAttribute('style','background-color:#2196F3; color:white;');
  div.setAttribute('class','alert');
  div.innerHTML='<i class="fa fa-times" onclick="hey()" aria-hidden="true"></i><p style="display:inline;"> '+data.name.toUpperCase()+' cancelled your request!</p><i'
  var container=document.getElementsByClassName('container')[0];
  container.insertBefore(div,container.children[2]);
});

socket.on('videochat',function(data){
document.getElementById('L').submit();
  })
