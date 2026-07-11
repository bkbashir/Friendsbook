// ===============================
// Friendsbook V5
// videoCall.js Part 1
// ===============================

let localStream=null;

const localVideo=document.getElementById("localVideo");
const remoteVideo=document.getElementById("remoteVideo");

window.startVideoCall=async()=>{

try{

localStream=await navigator.mediaDevices.getUserMedia({

video:true,

audio:true

});

localVideo.srcObject=localStream;

localVideo.play();

document.getElementById("videoCallPage").style.display="flex";

}catch(error){

alert("Camera or Microphone Permission Denied");

}

};

// ===============================
// End Call
// ===============================

window.endVideoCall=()=>{

if(localStream){

localStream.getTracks().forEach(track=>{

track.stop();

});

}

document.getElementById("videoCallPage").style.display="none";

};// ===============================
// Friendsbook V5
// videoCall.js Part 2
// ===============================

window.toggleMic=()=>{

if(!localStream) return;

localStream.getAudioTracks().forEach(track=>{

track.enabled=!track.enabled;

});

};

window.toggleCamera=()=>{

if(!localStream) return;

localStream.getVideoTracks().forEach(track=>{

track.enabled=!track.enabled;

});

};

// ===============================
// Switch Camera (Mobile)
// ===============================

let currentCamera="user";

window.switchCamera=async()=>{

if(!localStream) return;

localStream.getTracks().forEach(track=>track.stop());

currentCamera=

currentCamera==="user"

?

"environment"

:

"user";

localStream=

await navigator.mediaDevices.getUserMedia({

video:{facingMode:currentCamera},

audio:true

});

localVideo.srcObject=localStream;

};

// ===============================
// Full Screen
// ===============================

window.fullScreenVideo=()=>{

if(localVideo.requestFullscreen){

localVideo.requestFullscreen();

}

};

// ===============================
// Waiting UI
// ===============================

window.showCalling=()=>{

document.getElementById(

"callStatus"

).innerHTML="Calling...";

};// ===============================
// Friendsbook V5
// videoCall.js Part 3
// ===============================

// Incoming Call
window.receiveCall=(caller)=>{

document.getElementById("videoCallPage").style.display="flex";

document.getElementById("callStatus").innerHTML=

caller+" is calling...";

};

// Accept Call
window.acceptCall=()=>{

document.getElementById("callStatus").innerHTML=

"Connected";

};

// Reject Call
window.rejectCall=()=>{

endVideoCall();

};

// Speaker
window.toggleSpeaker=()=>{

if(!remoteVideo) return;

remoteVideo.muted=!remoteVideo.muted;

};

// Call Timer
let callSeconds=0;
let callInterval;

window.startCallTimer=()=>{

clearInterval(callInterval);

callSeconds=0;

callInterval=setInterval(()=>{

callSeconds++;

const m=String(Math.floor(callSeconds/60)).padStart(2,"0");

const s=String(callSeconds%60).padStart(2,"0");

document.getElementById("callTimer").innerHTML=

m+":"+s;

},1000);

};

// Stop Timer
window.stopCallTimer=()=>{

clearInterval(callInterval);

document.getElementById("callTimer").innerHTML="00:00";

};

// Close Call
window.closeCall=()=>{

stopCallTimer();

endVideoCall();

};

// ===============================
// End videoCall.js
// ===============================
