import mongoose from "mongoose";

//mongoose에게 우리 애플리케이션의 데이터들이 어떻게 생겼는지 알려줘야함
//model의 형태를 정의해줌.  = schema라고 부름
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

// model이름+ 데이터형태인 schema로 구성
const Video = mongoose.model("Video", videoSchema);
export default Video;