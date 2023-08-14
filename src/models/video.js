import mongoose from "mongoose";

//mongoose에게 우리 애플리케이션의 데이터들이 어떻게 생겼는지 알려줘야함
//model의 형태를 정의해줌.  = schema라고 부름
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  //default: Date.now는 즉각 실행하지만 mongoose가 내가 새로운 비디오를 생성했을 때만 실행시켜줌
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// model이름+ 데이터형태인 schema로 구성
const Video = mongoose.model("Video", videoSchema);
export default Video;