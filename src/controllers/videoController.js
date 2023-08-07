//view name 쓰기 home
//res.render로 home.pug를 렌더링
//파일명은 띄어쓰기가 있으면 안됌
//파일명은 소문자여야함
export const trending = (req, res) => res.render("home", { pageTitle: "Home" });

export const see = (req, res) => res.render("watch");
export const edit = (req, res) => res.render("edit");

export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};