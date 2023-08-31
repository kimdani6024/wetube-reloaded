const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

// const handleStart = async () => {
// // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
//   const stream = await navigator.mediaDevices.getUserMedia({
    let stream;
    let recorder;
    let videoFile;

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = videoFile;
        // url을 저장하게 해준다
        a.download = "MyRecording.webm";
        document.body.appendChild(a);
        a.click();
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
        // createObjectURL : 브라우저 메모리에서만 가능한 url을 만들어줌
        // 미리보기
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
        // upload.pug
        video.srcObject = stream;
        video.play();
      }; 



init();


startBtn.addEventListener("click", handleStart);