window.onload = function () {
  this.videoHeight();
};
window.addEventListener("resize", () => videoHeight());

const conf = {
  video: true,
  audio: true,
};

function initStream() {
  // navigator.getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia)
  /* if(navigator.getUserMedia){
          navigator.getUserMedia(conf, 
              (stream)=> console.log(stream),
              (err)=> console.log("error" , err)
              )
      }else{
          console.log('WebRtc not supported');
      }*/

  consoleOnDom("msg", "getting media access");
  //1
  navigator.mediaDevices
    .getUserMedia(conf)
    .then((stream) => {
      const video = document.querySelector("video");
      video.srcObject = stream;
    })
    .catch((err) => consoleOnDom("error", err.message));

  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      let info = "";
      consoleOnDom("msg", "connected devices");
      devices.forEach((device) => {
        const { deviceId, groupId, label, kind } = device;
        info = `device Id: ${deviceId}\ngroup Id: ${groupId}\nlabel: ${label}\n kind: ${kind}`;
        consoleOnDom("msg", info);
        info = "";
      });
    })
    .catch((err) => consoleOnDom("error", err.message));
}

function consoleOnDom(cls, message) {
  const error = document.querySelector("#console");
  const span = document.createElement("span");
  span.innerText = message;
  span.className = cls;
  error.appendChild(span);
}

function videoHeight() {
  const video = document.querySelector("video");
  video.style.height = `${Math.round(window.innerHeight / 3)}px`;
  consoleOnDom("msg", window.innerHeight / 3);
}
