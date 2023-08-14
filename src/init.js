import "./db";
import "./models/Video";
//app이 정의되지 않아서 오류가 남음. 그래서 server.js에서 export default app;해줌
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);