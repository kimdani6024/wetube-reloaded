import express from "express";

const PORT = 4000;
//application 생성
const app = express();

//application 설정한 후 외부에 개방
//브라우저가 get request를 보냄
//get : 페이지를 가져옴
const handleHome = () => console.log("somebody is trying to go home")
//누군가 root page로 get request를 보낸다면 반응하는 callback
app.get("/", handleHome); // 브라우저가 "/" url 좀 가져다줘 하는 것


//listen : 서버가 시작될 때 작동하는 함수
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)










