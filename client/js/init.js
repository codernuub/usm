function autoAdjustVideoArea() {
    const lecture = document.querySelector('.lecture');
    const video = document.createElement('video');
    video.width = lecture.clientWidth;
    video.height = lecture.clientHeight;
    lecture.insertBefore(video, lecture.lastElementChild)
}

//autoAdjustVideoArea()
//window.addEventListener('orientationchange', () => autoAdjustVideoArea())