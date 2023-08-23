import express from "express";
import {
    watch,
    getUpload,
    postUpload,
    getEdit,
    postEdit,
    deleteVideo,
  } from "../controllers/videoController";
  import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

//id 숫자+문자 가능하도록 정규식 만들기
//https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions
videoRouter.get("/:id([0-9a-f]{24})", watch);

videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);


videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);


videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);

export default videoRouter;

