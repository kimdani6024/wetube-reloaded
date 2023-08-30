import Video from "../models/Video";
import User from "../models/User";

//view name 쓰기 home
//res.render로 home.pug를 렌더링
//파일명은 띄어쓰기가 있으면 안됌
//파일명은 소문자여야함


// export const home = (req, res) => {
//   //database와 연결
//   //{}가 비어있으면 모든 형식을 찾는다는 걸 뜻함. 모든 형태의 비디오를 찾는 것 
//   //그다음단계로 callback을 전송 : err, docs라는 signature를 가짐 docs는 videos로 바꿔도 상관없음
//   console.log("Start");
//   //moongoose는 {}부분을 가져오고 ()부분을 실행시킴
//   //database검색이 안 끝났을 때 render되는 걸 방지하기 위함
//   //callback의 장점은 추가적인 코드없이 에러들을 바로 볼 수 있음
//   //start, finished 다음에 videos를 출력
//   Video.find({}, (error, videos) => {
//   if(error){
//     return res.render("server-error")
//   }
//   console.log("I finish first");
// };
export const home = async (req, res) => {
  try {
  //위에서 아래로 순서대로 출력해줌 
  //코드 실행 중 오류 발생시 아래코드 출력해줌 
  //desc : 내림차순
  const videos = await Video.find({})
  .sort({ createdAt: "desc" })
  .populate("owner");
  //render뒤에 redirect가 올때 유의해야함. 두 function중 하나만 옴. return을 적어서 실수를 방지하는 게 좋음
  return res.render("home", { pageTitle: "Home", videos });
}
  catch {
    return res.render("server-error")
  }
};

export const watch = async (req, res) => {  // videoRouter.get("/:id(\\d+)", see);에서 id얻음
  // const id = req.params.id;
  const { id } = req.params;
  //findById는 id로 영상을 찾아낼 수 있는 기능을 지원해줌
  // const video = await Video.findById(id);
  // const owner = await User.findById(video.owner);
  // 몽구스는 objectID가 User에서 오는 걸 암
  // populate를 하지 않으면 그저 string값만 가짐 
  // populate를 하면 User 객체 전체를 값으로 가짐 > owner : objectid > 이 id가 user에서 옴
  const video = await Video.findById(id).populate("owner");

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  //watch.pug에 video 데이터 전송해주기 
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  //수정할 비디오 id를 찾아야함
  // 비디오정보
  const { id } = req.params;
  // user 정보
  const {
    user: { _id },
  } = req.session;

  //video object가 꼭 필요함. 
  //object를 edit template(return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });)로 보내줘야해서
  const video = await Video.findById(id);
  //video가 존재하지 않는다면
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  //비디오 주인과 유저가 같은사람이 아니면 비디오 편집못하게 막음
  // 자바스크립트에선 데이터형식도 비교하기때문에 string을 입혀줘서 비교하자
  // watch.pug도 같음
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  //video가 존재한다면
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  // 비디오정보
  //video object가 필요없음 단순히 영상이 존재하는지만 확인하면 됌
  //어느 비디오를 수정중인지 알아야하니까
  //video route로부터 id를 얻어와서 /video/id페이지로 redirect(자동이동)시켜줌
  const { id } = req.params; // = const id = req.params.id
  //req.body에는 form을 통해 submit된 데이터의 키-값 쌍을 포함
  //form으로 부터 정보를 가져옴 edit.pug의 name"title"을 따옴
  //console.log(req.body)
  // = const title = req.body.title
  const { title, description, hashtags } = req.body;
  //영상을 검색
  //https://mongoosejs.com/docs/api/model.html#Model.exists() 
  const video = await Video.findById(id);
  //영상 존재하는지 확인, 없다면 404 렌더
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  //영상 정보 업데이트
  //두개의 인자가 필요, 1 : 업데이트 하고 하자는 영상의 id, 2 : 업데이트할 정보 혹은 내용
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  //videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
  return res.redirect(`/videos/${id}`);
};


export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  // 영상을 업로드할때 업로드하는 사용자의 id를 전송해야함
  // 현재 로그인된 사용자를 말함
  const {
    user: { _id },
  } = req.session;
  // multer는 req.file을 제공해줌. file안에 path가 있음
  // fileUrl만들어주기 > video.js에서
  const { path: fileUrl } = req.file;
  //video.js참고
  const { title, description, hashtags } = req.body;
  //왼쪽 title 등은 schema의 것
  //try는 video.js에서 required: true입력함으로써 생기는 에러를 잡기위해 사용
  //DB에 new video를 저장하는것. new video는 js object를 생성하는 것
  try {
    // newVideo id를 User의 videos array에 추가
    const newVideo = await Video.create({
      title,
      fileUrl,
      description,
      // 영상의 소유주인 현재 로그인중인 유저의 id를 쓰겠다는뜻임.
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });

    // User 찾기
    const user = await User.findById(_id);
    // 업로드될 영상의 id(출저,기록)을 user model에도 저장해줘야 함.
    // array에 요소를 추가할때는 push
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");

  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  // 비디오정보 
  const { id } = req.params;

  const {
    user: { _id },
  } = req.session;
  // 비디오찾기 exist말고 findById하기
  const video = await Video.findById(id);
  // 유저찾기
  const user = await User.findById(_id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // 비디오를 찾으면, 영상 주인이 로그인된 유저의 id와 같은지 체크
  // populate는 전체정보가 제공되서 안씀.여기서는 id만 필요하니까
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  //remove말고 findByIdAndDelete을 쓰자
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id),1);
  user.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  //검색할 keyword들을 req.query에서 볼 수 있음
  //console.log(req.query) > {keyword: "python"}으로 검색됨됨
  //라우터로 지정한 :id -> req.params
  // pug파일에서 input으로 받은 내용 -> req.body(form이 POST일 때)
  // pug파일에서 input으로 받은 url내용 -> req.query (form이 GET일 때)
  const { keyword } = req.query;
  //keyword가 없다면 비어있지만 있다면 videos array는 업데이트 될 것 > let
  let videos = [];
  if (keyword) {
    //video를 찾는다
    videos = await Video.find({
      title: {
        //$regex는 정규표현식의 약자 > keyword로 시작하는 단어만 검색하고 싶다면 $를 맨앞에
        //i는 대문자와 소문자를 구분하지 않는 역할
        //MongoDB 필터 엔진
        //https://docs.mongodb.com/manual/reference/operator/query/regex/
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  //serch.pug가 base.pug를 기본으로 하고 있어서 꼭 pagetitle을 써줘야함
  return res.render("search", { pageTitle: "Search", videos });
};

// 영상조회수
export const registerView = async (req, res) => {
  // apiRouter.js에서 id(url)를 가지고 video를 가지고옴
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404);
  }
  // Video.js - meta
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.status(200);
};
