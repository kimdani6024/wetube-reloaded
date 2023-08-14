import Video from "../models/Video";


//view name 쓰기 home
//res.render로 home.pug를 렌더링
//파일명은 띄어쓰기가 있으면 안됌
//파일명은 소문자여야함
export const home = (req, res) => {
  //database와 연결
  //{}가 비어있으면 모든 형식을 찾는다는 걸 뜻함. 모든 형태의 비디오를 찾는 것 
  //그다음단계로 callback을 전송 : err, docs라는 signature를 가짐 docs는 videos로 바꿔도 상관없음
  console.log("Start");
  //moongoose는 {}부분을 가져오고 ()부분을 실행시킴
  //database검색이 안 끝났을 때 render되는 걸 방지하기 위함
  Video.find({}, (error, videos) => {
    console.log("Finished");
    return res.render("home", { pageTitle: "Home", videos });
  });
  console.log("I finish first");
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
  const { title } = req.body;
  return res.redirect("/");
};