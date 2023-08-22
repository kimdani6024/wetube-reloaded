import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
});

//유저가 form에 입력한 password로 저장되지 않고 해싱한 다음에 암호화된 데이터가 저장
userSchema.pre("save", async function () {
  //this = creat되는 user를 가리킴
  //bcrypt.hash(암호화될 데이터, saltRounds = 몇번 해싱할지)
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;