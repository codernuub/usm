
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const buttons = [...document.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, stop] = buttons;

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

//get all video input source
const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join('');
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    consoleOnDom('msg', `requesting ${cameraOptions.value}`)
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }
    };
    startStream(updatedConstraints);
  }
};

//get requested media 
const startStream = async (constraints, requestedDeviceChange) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream, requestedDeviceChange);
  }
  catch (err) {
    consoleOnDom('error', err.message)
  }
};
//output video on video element
const handleStream = (stream, requestedDeviceChange) => {
  video.srcObject = stream;
  window.stream = stream;
  streamStarted = true;
};

getCameraSelection();


//camera change
cameraOptions.onchange = () => {
  try {
    /*stop current camera stream here*/
    if(window.stream)
    window.stream.getTracks().forEach(track => track.stop())

    /*stop current camera stream here*/
    consoleOnDom('msg', `requesting ${cameraOptions.value}`)
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }
    };
    startStream(updatedConstraints);
  }
  catch (err) {
    consoleOnDom('error', err.message)
  }
};

//pause video
const pauseStream = () => video.pause();

pause.onclick = pauseStream;

