import express from "express";
import morgan from "morgan";

const PORT = 4000;
//application 생성
const app = express();

//logger함수는 middleware를 return해줌
const logger = morgan("dev")


//<application 설정한 후 외부에 개방>


const home = (req,res) => {
    console.log("I will respond");
    return res.send("hello")
};

const login = (req,res) => {
    return res.send("login")
};

app.use(logger) 
app.get("/", home);
app.get("/login", login);




//listen : 서버가 시작될 때 작동하는 함수
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)










