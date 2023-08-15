import mongoose from "mongoose";

//mongoose에게 우리 애플리케이션의 데이터들이 어떻게 생겼는지 알려줘야함
//model의 형태를 정의해줌.  = schema라고 부름
//https://mongoosejs.com/docs/schematypes.html
const videoSchema = new mongoose.Schema({
  //trim:공백을 없애줌
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  //default: Date.now는 즉각 실행하지만 mongoose가 내가 새로운 비디오를 생성했을 때만 실행시켜줌
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

//middleware는 무조건 model이 생성되기 전에 만들어야 함
//middleware로 호출된 async function을 보냄
videoSchema.pre("save", async function () {
  //hashtags array에서 첫번째 element를 뽑음
  //>"for","real","now"
  //이렇게 하지 않으면 input에 입력된 값이 하나의 element로 array에 입력되기 떄문임 
  //> "for,real,now"
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

// model이름+ 데이터형태인 schema로 구성
const Video = mongoose.model("Video", videoSchema);
export default Video;