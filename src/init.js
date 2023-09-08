
// regeneratorRuntime is not defined 오류에 대한 해결법 > async와 await을 사용할 수 있게 해줌
import "regenerator-runtime";
// package-lock을 참고하면 첫 애플리케이션은 init.js로 시작함
// 필요한 모든 파일 윗 부분에 requre를 넣어야 하니까 init.js에 입력
// require("dotenv").config();
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
//app이 정의되지 않아서 오류가 남음. 그래서 server.js에서 export default app;해줌
import app from "./server";

const PORT = 3000;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT,handleListening);