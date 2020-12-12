const live = document.querySelector(".live");
window.addEventListener('DOMContentLoaded', () => {
  const myvideo = getVideoEL();
  myvideo.muted = true;
  startStream()
    .then((stream) => window.stream = stream)
    .catch(() => window.stream = null)
    addVideoToStream(myvideo, window.stream)

})
const socket = io("/");
const mypeer = new Peer();
const peers = {};

mypeer.on("open", (id) => {
  doc.log("myid " + id);
  socket.emit("join-room", { roomId, userId: id });
});

mypeer.on("call", (call) => {
  doc.log('Incoming call');
  call.answer(window.stream);
  call.on("stream", (userStream) => addVideoToStream(getVideoEL(), userStream));
  call.on("error", (err) => doc.error(err))
});

mypeer.on("error", (err) => doc.error(err));
/*check peer connection*/

/*sockets*/
socket.on("user-connected", (userId) => {
  doc.log("calling new user " + userId);
  if (!window.stream)
    callNewUser(userId, window.stream);
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
      connectToNewUser(userId, stream);
    });
    //when new call comes : user call with own stream
    mypeer.on("call", (call) => {
      call.answer(stream); //respond with my own stream
      //take user stream and append in body
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
  call.on("stream", (userStream) => addVideoToStream(userVideo, userStream));
  call.on("close", () => userVideo.remove());
  call.on("error", (err) => doc.error(err));
  peers[userId] = call;
}

//dom related fucntion

//get requested media
const startStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    
    return stream;
  } catch (err) {
    doc.error(err.message);
    return null;
  }
};

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
