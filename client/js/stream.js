const lecture = document.querySelector(".lecture");
const video = document.querySelector("video");
const cameraOptions = document.querySelector(".video-options>select");
const buttons = [...document.querySelectorAll("button")];
let streamStarted = false;

const [play, pause, zoom, torch] = buttons;

const videoConfig = {
  width: video.clientWidth,
  height: video.clientHeight
}

play.onclick = () => {
  if (streamStarted) {
    video.play();
    return;
  }
  if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
    doc.log(`requesting ${cameraOptions.value}`);
    const constraints = {
      video: {
        ...videoConfig,
        facingMode: cameraOptions.value,
        advanced: [{ zoom: 400 }]

      },
    };
    startStream(constraints);
  }
};

//get requested media
const startStream = async (constraints) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
  } catch (err) {
    doc.error(err.message)
  }
};
//output video on video element 
const handleStream = (stream) => {
  video.srcObject = stream;
  window.stream = stream;
  streamStarted = true;
  video.play();
};

//camera change
cameraOptions.onchange = () => {
  try {
    const track = window.stream.getTracks()[0];
    track.applyConstraints({ facingMode: cameraOptions.value });
  } catch (err) {
    doc.error(err.message)
  }
  /* try {
    
     if (window.stream)
       window.stream.getTracks().forEach((track) => track.stop());
    
     doc.log(`requesting ${cameraOptions.value}`);
     const constraints = {
       video: {
         ...videoConfig,
         facingMode: cameraOptions.value,
       },
     };
     startStream(constraints)
 
   } catch (err) {
     doc.error(err.message);
   }*/
};

//pause video
const pauseStream = () => video.pause();
pause.onclick = pauseStream;


zoom.onclick = function () {
  try {
    const track = window.stream.getTracks()[0];
    const capabilities = track.getCapabilities()
    // Check whether zoom is supported or not.
    if (!capabilities.zoom) {
      throw { message: 'zoom capabalities not found' }
    }
    track.applyConstraints({ advanced: [{ zoom: capabilities.zoom.min }] });
  } catch (err) {
    doc.error(err.message)
  }

}

let flash = false;
torch.onclick = function () {
  try {
    const track = window.stream.getTracks()[0];
    const capabilities = track.getCapabilities();
    // Check whether zoom is supported or not.
    if (!capabilities.torch) {
      throw { message: 'torch capabalities not found' }
    }
    flash = !flash;
    track.applyConstraints({ advanced: [{ torch: flash }] });
  } catch (err) {
    doc.error(err.message);
  }
}