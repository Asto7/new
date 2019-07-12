document.querySelector('#button').addEventListener('click',function(){
  var r=document.getElementById('result');
if('webkitSpeechRecognition' in window)
{
  var speechRecognizer=new webkitSpeechRecognition();
speechRecognizer.continuous=true;
speechRecognizer.interimResults=true;
speechRecognizer.lang='en-IN';
speechRecognizer.start();

var finalTrans='';

speechRecognizer.onresult=function(event){
  var interimTrans='';
  for(var i=event.resultIndex;i<event.results.length;i++)
  {
    console.log(event.results)
var transcript=event.results[i][0].transcript;
transcript.replace('\n','<br>');
if(event.results[i].isFinal)
{
  finalTrans+=transcript;
}
else{
  interimTrans+=transcript;
}
      }

r.innerHTML=finalTrans+'<span style="color:#999">'+interimTrans+'</span>'
}

speechRecognizer.onerror=function(event){};

}
else{
document.write('not works')
}
});















var message = document.querySelector('#messages');
var voice = document.querySelector('#voice');
voice.addEventListener('click',function(){
});
// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
// var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'


// var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;

var getUserMedia = require('getusermedia');

getUserMedia({ video: true, audio: true }, function (err, stream) {
  if (err) return console.error(err)

  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })

  peer.on('signal', function (data) {
    document.getElementById('yourId').value = JSON.stringify(data)
  })

  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n'
  })

  peer.on('stream', function (stream) {
    console.log(stream);
    var video = document.createElement('video');
    document.body.appendChild(video);

    //
    // var audio = document.createElement('audio');
    // document.body.appendChild(audio);


    // video.src = window.URL.createObjectURL(stream);
    video.srcObject = stream;
    // audio.srcObject = stream;

    video.play()
    // audio.play()

  })
})
