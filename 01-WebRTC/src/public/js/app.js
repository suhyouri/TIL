const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");
call.hidden = true;

let myStream;
let muted = false;
let camera = false;
let roomName = "";
let myPeerConnection;
let myDataChannel;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    // console.log(devices);
    const cameras = devices.filter(device => device.kind === "videoinput");
    // console.log(cameras);
    // console.log(myStream.getVideoTracks()); 
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach((camera) => {
      const option = document.createElement("option")
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    })
  } catch (e) {
    console.log(e);
  }
}


async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };

  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
    
    // console.log(myStream);
  } catch (e) {
    console.log(e);
  }
}

// getMedia();

function handleMuteClick() {
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "unmute";
    muted = true;
  } else {
    muteBtn.innerText = "mute";
    muted = false;
  }
};
function handleCameraClick() {
   myStream
     .getVideoTracks()
     .forEach((track) => (track.enabled = !track.enabled));
  if (!camera) {
    cameraBtn.innerText = "Turn Cam On";
    camera = true;
  } else {
    cameraBtn.innerText = "Turn Cam Off";
    camera = false;
  }
};

async function handleCameraChange() {
  // console.log(camerasSelect.value);
  await getMedia(camerasSelect.value);
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    // console.log(myPeerConnection.getSenders());
    const videoSender = myPeerConnection.getSenders().find(sender => sender.track.kind === "video");
    // console.log(videoSender);
    videoSender.replaceTrack(videoTrack);
  }
};


muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("click", handleCameraChange);

//Welcome Form (choose A room)

const welcome = document.getElementById("welcome");

const welcomeForm = welcome.querySelector("form");

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

async function handleWelcomeSubmit(e) {
  e.preventDefault();
  const input = welcomeForm.querySelector("input");
  await initCall();
  // console.log(input.value);
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

//Socket Code

socket.on("welcome", async () => {
  // console.log("someone joined!");
  myDataChannel = myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("message", (e) => {
    console.log(e.data);
  });
  console.log("made data channel");
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  // console.log(offer);
  console.log("sent the offer: ")
  socket.emit("offer", offer, roomName);
})

socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (e) => {
    myDataChannel = e.channel;
    myDataChannel.addEventListener("message", (e) => {
      console.log(e.data);
    });
  });
  // console.log(offer);
  console.log("recieved the offer: ");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  // console.log(answer);
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the anwser: ");
})

socket.on("answer", answer => {
  console.log("recieved the answer")
  myPeerConnection.setRemoteDescription(answer);
})

socket.on("ice", (ice) => {
  myPeerConnection.addIceCandidate(ice);
  console.log("recieved candidiate");
})

//RTC Code

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });

  myPeerConnection.addEventListener("icecandidate", handleIce); 

  // console.log(myStream.getTracks());
  // myPeerConnection.addEventListener("addstream", handleAddStream);//iphone woudldn't work
  myPeerConnection.addEventListener("track", handleTrack);
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
  console.log("got ice candidate")
  // console.log(data);
}

//
function handleAddStream(data) {
  const peerFace = document.getElementById("peerFace");
  // console.log("got an stream from my peer:");
  // console.log("peers(other)' stream"+data.stream);
  // console.log("mystream(me)" + myStream);
  peerFace.srcObject = data.stream;
}

//Iphone need this! 
function handleTrack(data) {
  console.log("handle track");
  const peerFace = document.querySelector("#peerFace");
  peerFace.srcObject = data.streams[0];
}

