import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";


//현재 작업 디렉토리
// console.log(process.cwd())

//application 생성
const app = express();

//logger함수는 middleware를 return해줌
const logger = morgan("dev")



//<application 설정한 후 외부에 개방>

//express가 views 디렉토리에서 pug파일을 찾도록 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
//express가 form의 value들을 이해할 수 있도록 하고, 자바스크립트 형식으로 변형시켜줌
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);



export default app;