import mongoose from "mongoose";

//mongoose에게 우리 애플리케이션의 데이터들이 어떻게 생겼는지 알려줘야함
//model의 형태를 정의해줌.  = schema라고 부름
//https://mongoosejs.com/docs/schematypes.html
const videoSchema = new mongoose.Schema({
  //trim:공백을 없애줌
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 20 },
  //default: Date.now는 즉각 실행하지만 mongoose가 내가 새로운 비디오를 생성했을 때만 실행시켜줌
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  // video와 user를 연결시키기 위해서 db에서 db.users.remove({}), db.videos.remove({})해주기  
  // user : 해당 user가 업로드한 모든 영상의 id를 저장해줌
  // video : 해당 영상을 올린 user의 id를 저장해줌
  // ObjectId는 오직 mongoose에서만
  // ref : mongoose에게 owner에 id를 저장하겠다고 알려줘야 하기 떄문
  // mongoose에게 owner가 어떤 model의 objectld라고 알려줄거임. 
  // user.js const User = mongoose.model("User", userSchema);
  // 1개의 영상은 소유주가 1명이지만, 소유주는 여러 영상을 소유할 수 있어서 array임
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

// export const formatHashtags = (hashtags) =>
//   hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
// 부를 때 formatHashtags(hashtags)

//middleware는 무조건 model이 생성되기 전에 만들어야 함
//우리가 만든 function > static
//static : schema.static, 만들고자하는 static의 이름, function 필요함
videoSchema.static("formatHashtags", function (hashtags) {
  //hashtags array에서 첫번째 element를 뽑음
  //>"for","real","now"
  //이렇게 하지 않으면 input에 입력된 값이 하나의 element로 array에 입력되기 떄문임 
  //> "for,real,now"
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});


// model이름+ 데이터형태인 schema로 구성
const Video = mongoose.model("Video", videoSchema);
export default Video;