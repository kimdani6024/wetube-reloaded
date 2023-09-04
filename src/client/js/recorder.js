






import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";


const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
let stream;

let recorder;
let videoFile;



const handleDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  // writeFile : 가상의 세계에 파일을 생성
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  // ffmpeg.run : 가상컴퓨터에 이미 존재하는 파일을 input으로 받는것
  // "-r", "60" : 초당 60프레임으로 인코딩
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );



  // ffmpeg.FS을 이용해서 mp4파일을 가져온다.
  const mp4File = ffmpeg.FS("readFile", "output.mp4");

  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  // 실제파일 만들기
  // Blob : 배열안에 배열들을 받을 수 있음. 배열을 만들고 그 안에 buffer를 넣어주기
  // 자바스트립트에게 type: "video/mp4" 알려주기
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });

  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);

  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");

  a.href = mp4Url;
  // url을 저장하게 해준다
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();

  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
};


const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

/*
    const handleStart = () => {
      startBtn.innerText = "Stop Recording";
      startBtn.removeEventListener("click", handleStart);
      startBtn.addEventListener("click", handleStop);
    //  https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
    // 기록할 MediaStream이 지정된 새 MediaRecorder 개체를 만듬
    // stream:기록될 MediaStream. 이 소스 미디어는 navigator.mediaDevices.getUserMedia()를 사용하여 생성된 스트림이나 audio, video 또는 canvas 요소에서 가져올 수 있음
      const recorder = new window.MediaRecorder(stream)
    //   datavailable 이벤트의 이벤트핸들러
    // event로 data property를 가진 blobevent를 받게 됌
      recorder.ondataavailable = (e) => {
        console.log("recording done");
        console.log(e);
        // data를 받으면 사용자가 다운로드 받게 만들 수 있다.
        console.log(e.data);
      };
      //비활성화된 recorder
      console.log(recorder);
      //미디어 녹화를 시작
      recorder.start();
      //활성화된 recorder
      console.log(recorder);
      //기록을 중지
      setTimeout(() => {
        recorder.stop();
      }, 10000);
    };*/

const handleStart = () => {
  // start recording을 누르면 stop recording이 뜨고 eventlistener 제거
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  // 그리고 새로운 걸 추가해줌. 오래된 것을 제거했던것
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  // ondataavailable : 녹화가 멈추면 발생
  // handleStop에서 recorder.stop(); 녹화 종료 후
  recorder.ondataavailable = (event) => {
    // url : 파일을 가르킴
    // createObjectURL : 녹화를 종료하면 영상의 모든 정보를 가진 object url이 만들어짐
    // url을 통해 파일을 참조 할 수 있음
    // event.data도 blob임
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

// 시작
const init = async () => {
  // mediaDevices : 마이크, 카메라와 같은 미디어 장비들에 접근하게 함
  // stream : 어딘가에 넣어둘 0과 1로 이루어진 데이터
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);