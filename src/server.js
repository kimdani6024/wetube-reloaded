import express from "express";
import morgan from "morgan";

const PORT = 4000;
//application 생성
const app = express();

//logger함수는 middleware를 return해줌
const logger = morgan("dev")
app.use(logger);


//<application 설정한 후 외부에 개방>


const globalRouter = express.Router();
const handleHome = (req, res) => res.send("Home");

globalRouter.get("/", handleHome);

const userRouter = express.Router();

const handleEditUser = (req, res) => res.send("Edit User");

userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send("Watch Video");

videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);






//listen : 서버가 시작될 때 작동하는 함수
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)










