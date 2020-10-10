const lecture = document.querySelector(".lecture");
const video = document.querySelector("video");
const cameraOptions = document.querySelector(".video-options>select");
const buttons = [...document.querySelectorAll("button")];
let streamStarted = false;

const [play, pause, stop] = buttons;

const videoConfig = {
  width: {
    min: 1280,
    ideal: 1920,
    max: 2560,
  },
  height: {
    min: 720,
    ideal: 1080,
    max: 1440,
  },
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    return;
  }
  if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
    consoleOnDom("msg", `requesting ${cameraOptions.value}`);
    const constraints = {
      video: {
        ...videoConfig,
        facingMode: cameraOptions.value,
      },
    };
    startStream(constraints);
  }
};

//get requested media
const startStream = async (constraints, requestedDeviceChange) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream, requestedDeviceChange);
  } catch (err) {
    consoleOnDom("error", err.message);
  }
};
//output video on video element
const handleStream = (stream, requestedDeviceChange) => {
  video.srcObject = stream;
  window.stream = stream;
  streamStarted = true;
  video.play();
};

//camera change
cameraOptions.onchange = () => {
  try {
    /*stop current camera stream here*/
    if (window.stream)
      window.stream.getTracks().forEach((track) => track.stop());

    /*stop current camera stream here*/
    consoleOnDom("msg", `requesting ${cameraOptions.value}`);
    const constraints = {
      video: {
        ...videoConfig,
        facingMode:cameraOptions.value,
      },
    };
    startStream(constraints);
  } catch (err) {
    consoleOnDom("error", err.message);
  }
};

//pause video
const pauseStream = () => video.pause();

pause.onclick = pauseStream;
