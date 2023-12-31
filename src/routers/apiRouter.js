// API : 백엔드가 템플릿을 렌더링 하지 않을때 프론트와 백엔드가 통신하는 방법

import express from "express";
import { registerView, createComment, removeComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
// server.js, videocontroller.js, apirouter.js, commentsection.js
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comment/:id([0-9a-f]{24})/remove", removeComment);

export default apiRouter;