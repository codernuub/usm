const socket = io("/");
const mypeer = new Peer(undefined, {
  host: "/",
  port: "443",
});
const peers = {};

const live = document.querySelector(".lecture");
const myvideo = getVideoEL();
myvideo.muted = true;

window.navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    //my video on my computer
    addVideoToStream(myvideo, stream);
    //new user connected event
    socket.on("user-connected", (userId) => connectToNewUser(userId, stream));
    //when new call comes : user call with own stream
    mypeer.on("call", (call) => {
      call.answer(stream); //respond with my own stream
      //take user stream and append in body
      call.on("stream", (userStream) => addVideoToStream(getVideoEL(), userStream));
    });

  })
  .catch((err) => console.log(err));

mypeer.on("open", (id) => socket.emit("join-room", { roomId, userId: id }));
//remove user video when disconnected
socket.on("user-disconnected", (userId) => peers[userId].close());

//call to new user
function connectToNewUser(userId, stream) {
  //we send user our stream
  const call = mypeer.call(userId, stream);
  //when user respond with own stream
  const userVideo = getVideoEL();
  call.on("stream", (userStream) => addVideoToStream(userVideo, userStream));
  call.on("close", () => userVideo.remove());
  peers[userId] = call;
}

//lib
function getVideoEL() {
  return document.createElement("video");
}
function addVideoToStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => video.play());
  live.appendChild(video);
}
