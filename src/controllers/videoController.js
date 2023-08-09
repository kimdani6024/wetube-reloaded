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

export const postEdit = (req, res) => {};