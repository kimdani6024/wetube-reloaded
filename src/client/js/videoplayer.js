// watch.pug와 연결

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");



const handlePlayClick = (e) => {
    // video.paused : https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};
// 플레이 버튼을 누르면 pause 버튼으로 보여줌
const handlePlay = () => (playBtn.innerText = "Pause");

const handlePause = () => (playBtn.innerText = "Play");

// mute누르면 음소거 > unmute누르면 볼륨 제대로 돌아오기
const handleMute = (e) => {};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);