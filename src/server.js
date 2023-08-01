import express from "express";

const PORT = 4000;
//express application 생성
const app = express();

//app이 listen해야함
//서버 : 항상 켜져있는 컴퓨터, requesting을 항상 주목함
//google에 접속한다면 google에 request를 보낸거임
//서버는 그것을 주목함

//listen : 서버가 시작될 때 작동하는 함수
//callback을 작성하기전에 서버에게 어떤 port를 listening할지 얘기해줘야함
//port : 컴퓨터의 문이나 창문같은 것
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)

//서버를 시작했다면 localhost를 통해서 접속해서 확인
//http://localhost:4000/






