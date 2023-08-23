import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import {localsMiddleware} from "./middlewares";

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



//session middleware -> router앞에 설정
//사이트로 들어오는 모두를 기억하게 함
// 브라우저가 서버에게 로그인을 요청해.
// 서버는 세션을 브라우저에게 줘
// 브라우저는 쿠키에 세션을 보관해
// 후에 재방문시 세션을 보여주면 자동으로 로그인
// 쿠키 : 백엔드가 브라우저에게 주는 정보
app.use(
    session({
      // 쿠키에 sign할때 사용하는 string
      // 쿠키에 sing하는 이유 : 백엔드가 쿠키를 줬다는걸 보여주기 위함
      secret: process.env.COOKIE_SECRET,
      // 세션을 수정할때만 db에 저장하고 쿠키를 넘겨줌 > 우리는 로그인할때만 세션을 수정함
      // 백엔드가 로그인한 사용자에게만 쿠키를 주도록 설정
      // 기억하고 싶은사람들에게만 쿠키를 주고 있는데, 그게 바로 우리유저임
      // (usercontroller.js참조)
      // req.session.loggedIn = true;
      // req.session.user = user;
      resave: false,
      saveUninitialized: false,
      // 세션들 mongodb database에 저장
      store: MongoStore.create({ mongoUrl: process.env.DB_URL}),  
    })
  );



//middleware는 session 다음에 와야함
app.use(localsMiddleware);
// 풀더를 노출시키는 방법. 노출시키고 싶은 풀더의 이름을 쓰면됌. 디렉토리 내부의 파일을 제공한다
app.use("/uploads", express.static("uploads"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);



export default app;

