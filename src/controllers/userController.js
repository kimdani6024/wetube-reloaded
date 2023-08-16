import User from "../models/User";


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
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
      });
    }
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  };

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");