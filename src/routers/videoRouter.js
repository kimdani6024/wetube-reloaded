import express from "express";
import {
    watch,
    getUpload,
    postUpload,
    getEdit,
    postEdit,
  } from "../controllers/videoController";


const videoRouter = express.Router();

//id 숫자+문자 가능하도록 정규식 만들기
//https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions
videoRouter.get("/:id([0-9a-f]{24})", watch);
// videoRouter.get("/:id(\\d+)/edit", getEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;