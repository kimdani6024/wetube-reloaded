// watch.pug와 연결

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

// 볼륨시작. 0.5
let volumeValue = 0.5;
// video.volume은 watch
// volumeValue은 videoplayer.js 둘 중 하나만 바껴도 다른 곳에 적용가능하도록 설정
video.volume = volumeValue;



const handlePlayClick = (e) => {
    // video.paused : https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
    // 플레이 버튼을 누르면 pause 버튼으로 보여줌
  playBtn.innerText = video.paused ? "Play" : "Pause";
};



// 비디오가 음소거 됐는지 안됐는지 체크해야함
const handleMuteClick = (e) => {

    if (video.muted) {
    // 만약 음소거(mute)를 누른상태라면 Unmute가 뜨고 음소거가 되어야함
    // 비재생
      video.muted = false;
    //muteBtn.innerText = "Unmute"
    } else {
    // 재생
      video.muted = true;
    //muteBtn.innerText = "Mute"
    }

    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    // 만약 음소거(mute)를 누른상태라면 볼륨이 0이 되어야함. 아니면 원래 볼륨으로 되돌아가기
    volumeRange.value = video.muted ? 0 : volumeValue;
  };
  
  const handleVolumeChange = (event) => {
    // target.event.value 확인하면 0.3 0.4 등의 결과값 
    const {
      target: { value },
    } = event;

    // 만약 음소거한 상태에서 볼륨을 조절하면 음소거는 해제되어야함
    if (video.muted) {
      video.muted = false;
      muteBtn.innerText = "Mute";
    }
    // 볼륨이라는 변수를 업데이트해줌
    volumeValue = value;
    // 비디오의 볼륨을 바뀌게함
    video.volume = value;
  };

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);