import Video from "../models/Video";


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
  const videos = await Video.find({});
  //render뒤에 redirect가 올때 유의해야함. 두 function중 하나만 옴. return을 적어서 실수를 방지하는 게 좋음
  return res.render("home", { pageTitle: "Home", videos });
}
  catch {
    return res.render("server-error")
  }
};

export const watch = (req, res) => {
  // videoRouter.get("/:id(\\d+)", see);에서 id얻음
  // const id = req.params.id;
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching` });
};

export const getEdit = (req, res) => {
  //수정할 비디오 id를 찾아야함
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};

export const postEdit = (req, res) => {
  //어느 비디오를 수정중인지 알아야하니까
  //video route로부터 id를 얻어와서 /video/id페이지로 redirect(자동이동)시켜줌
  const { id } = req.params; // = const id = req.params.id
  //req.body에는 form을 통해 submit된 데이터의 키-값 쌍을 포함
  //form으로 부터 정보를 가져옴 edit.pug의 name"title"을 따옴
  //console.log(req.body)
  const { title } = req.body; // = const title = req.body.title

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  //video.js참고
  const { title, description, hashtags } = req.body;
  //왼쪽 title 등은 schema의 것
  const video = new Video({
    title: title,
    description: description,
    createdAt: Date.now(),
    //split을 사용하면 배열이 됌. 간단한 문장에서 배열 만들기 > split사용
    //array를 만들어 단어별 분리를 시킨 다음 #을 붙여줌
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  console.log(video);
  return res.redirect("/");
};