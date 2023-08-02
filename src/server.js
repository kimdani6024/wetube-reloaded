import express from "express";

const PORT = 4000;
//application 생성
const app = express();

//application 설정한 후 외부에 개방

//middleware
const gossipMiddleware = (req, res, next) => {
    //req object연습
    console.log(`Someone is going to: ${req.url}`);
    next();
  };

//express > route handler의 첫번째 argument는 request object, 두번째 argument는 response object임
//finalware임으로 next argument가 필요없음
const handleHome = (req, res) => {
    return res.send("I love middlewares");
    // return res.end()
}
//누군가 root page로 get request를 보낸다면 반응하는 callback
//handleHome은 finalware, return시 연결이 종료되니까.
app.get("/", gossipMiddleware, handleHome);




//listen : 서버가 시작될 때 작동하는 함수
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)










