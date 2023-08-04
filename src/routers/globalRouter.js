import express from "express";
//ctrl + 라우터 누르면 해당 파일로 이동
//../ : 지금 있는 풀더에서 벗어나는 것을 의미 
import { join, login } from "../controllers/userController";
import { trending, search } from "../controllers/videoController";

const globalRouter = express.Router();


globalRouter.get("/", trending);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);


export default globalRouter;