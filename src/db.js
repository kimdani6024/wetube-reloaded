import mongoose from "mongoose";

//url뒤에 database 이름 적어주기
mongoose.connect("mongodb://127.0.0.1:27017/wetube-reloaded", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);