import express from "express";
import {
    getEdit,
    postEdit,
    logout,
    see,
    startGithubLogin,
    finishGithubLogin,
    getChangePassword,
    postChangePassword,
  } from "../controllers/userController";
  import {
    protectorMiddleware,
    publicOnlyMiddleware,
    uploadFiles,
  } from "../middlewares";


const userRouter = express.Router();

// 로그인한 사람들만 로그아웃에 갈 수 있어야해서 protectorMiddleware 추가
// 인풋으로 아바타를 받아서(edit-profile) 파일을 uploads풀더에 저장(middleware) > 파일정보를 postedit에 전달
userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  // input에서 오는 아바타 파일 한개만 업로드함
  .post(uploadFiles.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

// publicOnlyMiddleware은 로그인 되어 있으면 startGithubLogin,finishGithubLogin으로 올 수 없게 보호
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

userRouter.get(":id", see);

export default userRouter;