import express from "express";

const PORT = 4000;
//application 생성
const app = express();

//application 설정한 후 외부에 개방

//express > route handler의 첫번째 argument는 request object, 두번째 argument는 response object임
const handleHome = (req, res) => {
    return res.send("<h1>I still love you</h1>"); 
    // return res.end()
}
//누군가 root page로 get request를 보낸다면 반응하는 callback
app.get("/", handleHome); 


const handleLogin = (req, res) => {
    return res.send({ message: "Login here." });
};
app.get("/login", handleLogin); 

//listen : 서버가 시작될 때 작동하는 함수
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)










