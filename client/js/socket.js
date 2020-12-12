const live = document.querySelector(".live");
const myvideo = getVideoEL();
myvideo.muted = true;

const socket = io("/");
const mypeer = new Peer();
const peers = {};

mypeer.on("open", (id) => {
  doc.log("myid " + id);
  socket.emit("join-room", { roomId, userId: id });
});

mypeer.on("error", (err) => doc.error(err));
/*check peer connection*/

//remove user video when disconnected
socket.on("user-disconnected", (userId) => {
  doc.log("user-disconnected " + userId);
  if(peers[userId]) peers[userId].close();
});

window.navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    //my video on my computer
    //
    addVideoToStream(myvideo, stream);
    //new user connected event
    socket.on("user-connected", (userId) => {
      doc.log("user-connected " + userId);
      callNewUser(userId, stream);
    });

    mypeer.on("call", (call) => {
      doc.log('Incoming call')
      const userVideo = getVideoEL();
      call.answer(stream);
      call.on("stream", (userStream) => {
        doc.log('adding video from line 43')
        addVideoToStream(userVideo, userStream);
      });
      call.on('close', () => userVideo.remove());
    });

  })
  .catch((err) => {
    doc.error(err.message);
  });

//call new user
function callNewUser(userId, stream) {
  //call new user with userId & stream
  const userVideo = getVideoEL();
  mypeer.call(userId, stream)
    .on("stream", (userStream) => {
      doc.log('adding video from line 54 : callNewUser:func')
      addVideoToStream(userVideo, userStream);
    })
    .on("close", () => userVideo.remove())
  peers[userId] = call;
}

//dom related fucntion
function getVideoEL() {
  return document.createElement("video");
}

function addVideoToStream(video, stream) {
  try {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => video.play());
    live.appendChild(video);
  } catch (err) {
    doc.error(err);
  }
}
