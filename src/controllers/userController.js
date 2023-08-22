import User from "../models/User";
import fetch from "node-fetch";
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
  //req.body에서 가져온 username을 가지는 user를 찾음
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
  //const user = await User.findOne({ username });이용 
  const ok = await bcrypt.compare(password, user.password);
  //내가입력한 password가 해시값 password와 같지않으면
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }

  // 밑에 두줄이 우리가 실제로 세션을 초기화하는 부분
  // 우리는 로그인할때만 세션을 수정함
  
  //유저가 로그인하면 유저정보를 세션에 담아야함
  //req.session object에 정보를 저장하고 있음. 유저가 로그인에 성공했는지 안했는지는 상관없음
  req.session.loggedIn = true;
  //db에서 찾은 user
  req.session.user = user;
  return res.redirect("/");
};

//  a(href="https://github.com/login/oauth/authorize?client_id=3d40761ba7a0edd8472d&allow_signup=false") Continue with Github &rarr;
export const startGithubLogin = (req, res) => {
  // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
  const baseUrl = "https://github.com/login/oauth/authorize";
  // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    // read:user을 했기때문에 user의 정보를 읽을 수 있는 access_token을 받을 수 있음
    scope: "read:user user:email",
  };
  // 노션 설명 참조
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};


export const finishGithubLogin = async (req, res) => {
  // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
  // 깃헙이 준 코드를 가지고 access_token으로 교환을 함
  const baseUrl = "https://github.com/login/oauth/access_token";
  // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
    // 코드를 access_token으로 바꿈
    code: req.query.code,
  };
  // 아래의 parameter를 가지고 POST request를 해봄
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  // 1. fetch('url')로 다른 서버를 통해 데이터를 가져올 수있다. 하지만, res.body 에 담겨있는 날것의 url로는 제대로 된 객체를 받아올 수 없다.
  // 2.때문에 중간에 .json 함수가 response의 스트림을 가져와 끝까지 읽고, res.body의 텍스트를 promise의 형태로 반환한다.
  // 3. 다른 서버에서 데이터를 object 형식으로 받아온다.
  // ex){"coord":{"lon":139.01,"lat":35.02},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}]
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
      headers: {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
        // 돌려줄 데이터 타입에 대해 서버에게 알려주는 역할
        Accept: "application/json",
      },
    })
  ).json();

  // access_token은 깃허브 API URL를 fetch하는데 사용
  // access_token은 user가 모든걸 할 수 있게 해주진 않음.
  // scope에서 read:user을 했기때문에 user의 정보를 읽을 수 있는 access_token을 받을 수 있음
  // 깃헙 API를 이용해서 user 정보를 가져옴
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        // HTTP headers는 는 클라이언트와 서버가 request(or response)로 부가적인 정보를 전송할 수 있도록 해줌
        headers: {
          // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
          // Authorization
          // 보호된 리소스에 대한 접근을 허용하여 서버로 User agent를 인증하는 자격증명을 보내는 역할을 합니다
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);

  // https://docs.github.com/en/rest/reference/users#add-an-email-address-for-the-authenticated-user
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    // email은 배열 > primary랑 verified가 모두 true인 email 찾음
    const email = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!email) {
      return res.redirect("/login");
    }

  } else {
    return res.redirect("/login");
  }
};


export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");

export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");