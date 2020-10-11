function autoAdjustVideoArea() {
    const lecture = document.querySelector('.lecture');
    const video = document.createElement('video');
    video.width = lecture.clientWidth;
    video.height = lecture.clientHeight;
    lecture.insertBefore(video, lecture.lastElementChild)
}

window.addEventListener('DOMContentLoaded', () => autoAdjustVideoArea())
window.addEventListener('orientationchange', () => autoAdjustVideoArea())