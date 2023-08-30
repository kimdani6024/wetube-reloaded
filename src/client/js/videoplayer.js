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
const playBtnIcon = playBtn.querySelector("i");
const muteBtnIcon = muteBtn.querySelector("i");
const fullScreenIcon = fullScreenBtn.querySelector("i");



let controlsTimeout = null;

// 마우스가 멈추는걸 감지
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
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
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

    muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
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
  new Date(seconds * 1000).toISOString().substr(14, 5);


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
      fullScreenIcon.classList = "fas fa-expand";
    } 
    else {
      videoContainer.requestFullscreen();
      fullScreenIcon.classList = "fas fa-compress";
    }
  };

// 1. 아무것도 없는 상태에서 비디오 위로 마우스 움직임.
// 2. 즉시 showing이라는 클래스가 추가되고 3초짜리 showing을 지우는 타이머를 시작시킴.
// 3. 2초후 마우스를 다시 움직임.
// 4. if문 구절 때문에 3초짜리 showing을 지우는 타이머가 사라져 버리고, 타이머 값이 null로 바뀜 즉 타이머 사라짐.
// 5.그대로 클래스 showing만들고 다시 또다른 3초짜리 showing을 지우는 타이머 시작!.

// 그다음에는 무한 반복

// 만약 3초가 지났다? 그러면 타이머가 작동해서 showing을 지움

  const hideControls = () => videoControls.classList.remove("showing");


  const handleMouseMove = () => {
    // 3. 비디오 안에 있다가 나갔다 들어오면 timeout 취소
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      controlsTimeout = null;
    }
    // 유저가 마우스를 움직이면 오래된 timeout은 취소되고, 
    // 새로운 timeout(controlsMovementTimeout = setTimeout(hideControls, 3000); 만듬
    if (controlsMovementTimeout) {
      clearTimeout(controlsMovementTimeout);
      controlsMovementTimeout = null;
    }
    // 1 .처음 비디오 안으로 들어온다면 showing class실행
    // 1. 마우스를 움직일때 cleartimeout 실행
    videoControls.classList.add("showing");

    controlsMovementTimeout = setTimeout(hideControls, 3000);
  };
  
  const handleMouseLeave = () => {
    // 2. 비디오 밖으로 나간다면 time out
    controlsTimeout = setTimeout(hideControls, 3000);
  };

  // console.log(videoContainer.dataset)
  
  const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
      method: "POST",
    });
  };


playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
// 시간이 변경되는 걸 감지하는 evnet
video.addEventListener("timeupdate", handleTimeUpdate);
// 유저가 비디오 시청을 끝냈을 때 생기는 event
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
window.addEventListener("keydown", handlePlayenter);
fullScreenBtn.addEventListener("click", handleFullscreen);
