// watch.pug와 연결

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;

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

  
  const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);


  // 현재 비디오 시간
  const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    // watch.pug     
    timeline.value = Math.floor(video.currentTime);
  };
  
  // 누른곳으로 비디오시간 이동
  const handleTimelineChange = (event) => {
    const {
      target: { value },
    } = event;
    // 비디오 이동시간으로 값이 바뀌게
    video.currentTime = value;
  };

  // 비디오시간
  const handleLoadedMetadata = () => {
    // https://stackoverflow.com/questions/33316493/why-does-loadedmetadata-not-consistently-fire
    totalTime.innerText = formatTime(Math.floor(video.duration));
    // watch.pug 
    timeline.max = Math.floor(video.duration);
  };

  // 엔터키로 재생 및 일시정지
  const handlePlayenter = (event) => {
    if (event.code == "Enter") {
      handlePlayClick();
      }
  };

  const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
      document.exitFullscreen();
      fullScreenBtn.innerText = "Enter Full Screen";
    } 
    else {
      videoContainer.requestFullscreen();
      fullScreenBtn.innerText = "Exit Full Screen";
    }
  };


  const hideControls = () => videoControls.classList.remove("showing");


  const handleMouseMove = () => {
    // 3. 비디오 안에 있다가 나갔다 들어오면 timeout 취소
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
      clearTimeout(controlsMovementTimeout);
      controlsMovementTimeout = null;
    }
    // 1 .처음 비디오 안으로 들어온다면 showing 
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
  };
  
  const handleMouseLeave = () => {
    // 2. 비디오 밖으로 나간다면 time out
    controlsTimeout = setTimeout(hideControls, 3000);
  };
  

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
// 시간이 변경되는 걸 감지하는 evnet
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
window.addEventListener("keydown", handlePlayenter);
fullScreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);