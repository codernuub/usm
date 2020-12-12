//get requested media
const globalStream = null;
const startStream = async () => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch (err) {
    doc.error(err.message);
    return null;
  }
};

const live = document.querySelector(".live");
const myvideo = getVideoEL();
myvideo.muted = true;

startStream()
  .then((stream) => globalStream = stream)
  .catch(() => globalStream = null)

addVideoToStream(myvideo, globalStream)
doc.log(globalStream || 'Media naot supported')
const socket = io("/");
const mypeer = new Peer();
const peers = {};

mypeer.on("open", (id) => {
  doc.log("myid " + id);
  socket.emit("join-room", { roomId, userId: id });
});

mypeer.on("call", (call) => {
  doc.log('Incoming call');
  call.answer(globalStream || 'Media not supported');
  call.on("stream", (userStream) => {
    if (userStream === 'Media not supported') {
      doc.log('user dont have media support')
      return;
    }
    addVideoToStream(getVideoEL(), userStream)
  });

});

mypeer.on("error", (err) => doc.error(err));
/*check peer connection*/

//sockets
socket.on("user-connected", (userId) => {
  doc.log("calling new user " + userId);
  callNewUser(userId, globalStream || 'Media not supported');
});

//remove user video when disconnected
socket.on("user-disconnected", (userId) => {
  doc.log("user-disconnected " + userId);
  peers[userId].close();
});


/*window.navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    //my video on my computer
    addVideoToStream(myvideo, stream);
    //new user connected event
    socket.on("user-connected", (userId) => {
      doc.log("user-connected " + userId);
      callNewUser(userId, stream);
    });
   
    mypeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userStream) =>
        addVideoToStream(getVideoEL(), userStream)
      );
    });
  })
  .catch((err) => {
    doc.error(err.message)
  });*/

//call new user
function callNewUser(userId, stream) {
  //call new user with userId & stream
  const call = mypeer.call(userId, stream);
  //when user respond with own stream
  const userVideo = getVideoEL();
  //when user respond with our stream
  call.on("stream", (userStream) => {
    if (userStream === 'Media not supported') {
      doc.log('user dont have media support')
      return;
    }
    addVideoToStream(getVideoEL(), userStream)
  });
  call.on("close", () => userVideo.remove());
  call.on("error", (err) => doc.error(err));
  peers[userId] = call;
}

//dom related fucntion


function getVideoEL() {
  return document.createElement("video");
}

function addVideoToStream(video, stream) {
  try {
    if (!stream) {
      video.className = 'no-video';
      // video.title = "Media not sideo.title = "Media not suppoted"uppideo.title = "Media not suppoted"oted"
    } else {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => video.play());
    }
    live.appendChild(video);
  } catch (err) {
    doc.error(err);
  }
}
