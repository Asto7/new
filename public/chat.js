
let Peer = require('simple-peer')
let socket = io()
const video = document.querySelector('video')
const filter = document.querySelector('#filter')
let client = {}
let currentFilter
var resultFinal='';
var r=document.getElementById('results');



document.getElementById('fix').addEventListener('click',
function(){
  // console.log(JSON.stringify(resultFinal));
  document.getElementById('heavy').value=resultFinal;
socket.emit('over');
  document.getElementById('light').submit();

})


if('webkitSpeechRecognition' in window)
{
var speechRecognizer=new webkitSpeechRecognition();
speechRecognizer.continuous=true;
speechRecognizer.interimResults=true;
speechRecognizer.lang='en-IN';
speechRecognizer.start();

var finalTranscripts='';

speechRecognizer.onresult=function(event){
var interimR='';

for(var i=event.resultIndex;i<event.results.length;i++){
var transcript=event.results[i][0].transcript;
transcript.replace("\n","<br>");

if(event.results[i].isFinal){
  finalTranscripts+=transcript;
  socket.emit('saveText',{text:transcript,user:document.getElementById('me').value});
}

  else{interimR+=transcript;}
  }
  // if(r.innerHTML.length>100)
  // r.innerHTML='';
// r.innerHTML=finalTranscripts+'<span style="color:#999">'+interimR+'</span>'
};

speechRecognizer.onerror=function(event){
};}
socket.on('finalAdd',function(data){
  resultFinal += '<p><strong>' + data.user + ': </strong>' + data.text + '</p>';
r.innerHTML=resultFinal;
document.getElementById('history').value=resultFinal;
});



//get stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        socket.emit('NewClient')
        video.srcObject = stream
        video.play()

        filter.addEventListener('change', (event) => {
            currentFilter = event.target.value
            video.style.filter = currentFilter
            SendFilter(currentFilter)
            event.preventDefault
        })

        //used to initialize a peer
        function InitPeer(type) {
            let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
            peer.on('stream', function (stream) {
                CreateVideo(stream)
            })
            //This isn't working in chrome; works perfectly in firefox.
            // peer.on('close', function () {
            //     document.getElementById("peerVideo").remove();
            //     peer.destroy()
            // })
            peer.on('data', function (data) {
                let decodedData = new TextDecoder('utf-8').decode(data)
                let peervideo = document.querySelector('#peerVideo')
                peervideo.style.filter = decodedData
            })
            return peer
        }

        //for peer of type init
        function MakePeer() {
            client.gotAnswer = false
            let peer = InitPeer('init')
            peer.on('signal', function (data) {
                if (!client.gotAnswer) {
                    socket.emit('Offer', data)
                }
            })
            client.peer = peer
        }

        //for peer of type not init
        function FrontAnswer(offer) {
            let peer = InitPeer('notInit')
            peer.on('signal', (data) => {
                socket.emit('Answer', data)
            })
            peer.signal(offer)
            client.peer = peer
        }

        function SignalAnswer(answer) {
            client.gotAnswer = true
            let peer = client.peer
            peer.signal(answer)
        }

        function CreateVideo(stream) {
            CreateDiv()

            let video = document.createElement('video')
            video.id = 'peerVideo'
            video.srcObject = stream
            video.setAttribute('class', 'embed-responsive-item')
            document.querySelector('#peerDiv').appendChild(video)
            video.play()
            //wait for 1 sec
            setTimeout(() => SendFilter(currentFilter), 1000)

            video.addEventListener('click', () => {
                if (video.volume != 0)
                    video.volume = 0
                else
                    video.volume = 1
            })

        }

        function SessionActive() {
            document.write('Session Active. Please come back later')
        }

        function SendFilter(filter) {
            if (client.peer) {
                client.peer.send(filter)
            }
        }

        function RemovePeer() {
            document.getElementById("peerVideo").remove();
            document.getElementById("muteText").remove();
            if (client.peer) {
                client.peer.destroy()
            }
        }

        socket.on('BackOffer', FrontAnswer)
        socket.on('BackAnswer', SignalAnswer)
        socket.on('SessionActive', SessionActive)
        socket.on('CreatePeer', MakePeer)
        socket.on('Disconnect', RemovePeer)
socket.on('overend',function(){
document.getElementById('heavy').value=resultFinal;
document.getElementById('light').submit();
});

    })
    .catch(err => document.write(err))

function CreateDiv() {
    let div = document.createElement('div')
    div.setAttribute('class', "centered")
    div.id = "muteText"
    div.innerHTML = "Click to Mute/Unmute"
    document.querySelector('#peerDiv').appendChild(div)
}
