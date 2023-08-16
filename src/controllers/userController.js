import User from "../models/User";
import bcrypt from "bcrypt";


export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
      });
    }

    //username, email을 가진 user가 있는지 찾아봄.
    //https://docs.mongodb.com/manual/reference/operator/query/or/#mongodb-query-op.-or
    //$or 연산자는 둘 이상의 조건에 대해 논리적 OR 연산을 수행하고 조건 중 하나 이상을 충족하는 문서를 선택
    const exists = await User.exists({ $or: [{ username }, { email }] });
    //이미 사용중이라면
    if (exists) {
        //상태코드 400을 가지고 렌더함 > 크롬이 뭔가 에러가 있었다는 걸 알 수 있음, 패스워드 저장할거냐고 물어보지 않음
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
      });
    }
    try {
        await User.create({
          name,
          username,
          email,
          password,
          location,
        });
        return res.redirect("/login");
      } catch (error) {
        return res.status(400).render("join", {
          pageTitle: "Upload Video",
          errorMessage: error._message,
        });
      }
  };

  export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  //계정이 존재하는지 체크
  //받은 username과 일치하는 user가 있는지 확인
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
        pageTitle,
        errorMessage: "An account with this username does not exists.",
    });
  }
  // 패스워드가 일치하는지 체크
  //입력한 패스워드를 해싱하고, 그 값이 db에 있는 해시값과 같은지 비교
  // 패스워드를 알지 못해도 일치하는지 알수있음
  //bcrypt.compare(유저가 form에 입력한 패스워드, db에 있는 해시값)
  const ok = await bcrypt.compare(password, user.password);
  //내가입력한 password가 해시값 password와 같지않으면
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  return res.redirect("/");
};


export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");

export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");