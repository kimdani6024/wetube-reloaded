import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;
//application 생성
const app = express();

//logger함수는 middleware를 return해줌
const logger = morgan("dev")
app.use(logger);


//<application 설정한 후 외부에 개방>
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);




//listen : 서버가 시작될 때 작동하는 함수
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)










