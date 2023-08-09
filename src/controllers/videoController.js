let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];
//view name 쓰기 home
//res.render로 home.pug를 렌더링
//파일명은 띄어쓰기가 있으면 안됌
//파일명은 소문자여야함
export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  // videoRouter.get("/:id(\\d+)", see);에서 id얻음
  // const id = req.params.id;
  const { id } = req.params;
  // id를 이용해서 비디오를 찾을거임
  // 배열은 0부터 시작하므로 id-1
  const video = videos[id - 1];
  // watch라는 템플릿을 render해줌
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};

export const getEdit = (req, res) => {
  //수정할 비디오 id를 찾아야함
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = (req, res) => {
  //어느 비디오를 수정중인지 알아야하니까
  //video route로부터 id를 얻어와서 /video/id페이지로 redirect(자동이동)시켜줌
  const { id } = req.params; // = const id = req.params.id
  //req.body에는 form을 통해 submit된 데이터의 키-값 쌍을 포함
  //form으로 부터 정보를 가져옴 edit.pug의 name"title"을 따옴
  //console.log(req.body)
  const { title } = req.body; // = const title = req.body.title
  //비디오 업데이트해줌. 가짜 database사용하고 있어서 별로 중요한건 아님
  videos[id - 1].title = title;
  //자동으로 이동
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};