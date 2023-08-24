import User from "../models/User";
import Video from "../models/Video";
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
  // socialOnly: false > username과 password로만 로그인 할 수 있는 유저
  const user = await User.findOne({ username, socialOnly: false });
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

// 유저가 깃허브에서 돌아오면 URL에 ?code=xxxxx가 덧붙여진 내용을 받음
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
  // 파라미터들을 URL의 파라미터 string으로 바꿔줌
  const params = new URLSearchParams(config).toString();
  // baseUrl과 config를 더해서 다른 URL을 만듬
  // 깃허브가 준 code가 담겨있음
  const finalUrl = `${baseUrl}?${params}`;

  // 1. fetch('url')로 다른 서버를 통해 데이터를 가져올 수있다. 하지만, res.body 에 담겨있는 날것의 url로는 제대로 된 객체를 받아올 수 없다.
  // 2.때문에 중간에 .json 함수가 response의 스트림을 가져와 끝까지 읽고, res.body의 텍스트를 promise의 형태로 반환한다.
  // 3. 다른 서버에서 데이터를 object 형식으로 받아온다.
  // ex){"coord":{"lon":139.01,"lat":35.02},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}]
  const tokenRequest = await (
    await fetch(finalUrl, {
      // final URL로 POST request를 보냄
      method: "POST",
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
      headers: {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
        // 돌려줄 데이터 타입에 대해 서버에게 알려주는 역할
        Accept: "application/json",
      },
    })
  ).json();



  // 모든것이 올바르다면, 깃허브는 우리에게 access_token을 줌
  // scope에서 read:user을 했기때문에 user의 정보를 읽을 수 있는 access_token을 받을 수 있음
  // access_token은 깃허브 API와 상호작용할 때 씀
  // 깃헙 API를 이용해서 user 정보를 가져옴
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      // user 프로필을 받기위해 요청 > 그 요청은 ${apiUrl}/user로 감
      
      await fetch(`${apiUrl}/user`, {
        // HTTP headers는 는 클라이언트와 서버가 request(or response)로 부가적인 정보를 전송할 수 있도록 해줌
        headers: {
          // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
          // Authorization : 보호된 리소스에 대한 접근을 허용하여 서버로 User agent를 인증하는 자격증명을 보내는 역할
          // access_token을 주면 user데이터를 받을 수 있음
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);

  // 때때로 email 정보를 안줄때도 있어서 email API에게도 요청을 보내줘야함
  // https://docs.github.com/en/rest/reference/users#add-an-email-address-for-the-authenticated-user
    const emailData = await (
      // 위랑 똑같이 access_token으로 요청을 보내면
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    // email array를 줌 > primary랑 verified가 모두 true인 email 찾음
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    // 찾지 못한다면 로그인 페이지로 돌아감
    if (!emailObj) {
      return res.redirect("/login");
    }

    // primary랑 verified가 모두 true인 email 찾으면 데이터베이스에서 해당 email을 찾음
    let user = await User.findOne({ email: emailObj.email });
    // 깃헙 프로필의 email이 데이터베이스에 없을때, 그 email로 새로운 계정을 만들어서 user를 로그인시킴
    if (!user) {
      // 해당 email과 깃헙이 보낸 모든 데이터를 가지고 user를 만듬
      user = await User.create({
        // 프로필사진
        // avatarUrl이 없는 user는 email과 password로만 계정을 만들었단 소리
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        // 해당 계정은 깃허브로 만들어졌고, password가 없다는 뜻 > 로그인 폼 사용불가
        socialOnly: true,
        location: userData.location,
      });
    }
      // 깃헙 프로필의 email이 데이터베이스에 있을때 > 유저가 로그인 할 수 있게 해줌
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");

  } else {
    return res.redirect("/login");
  }
};
// 위의 기능이 완료되면 쿠키가 생김

// 네이버,카카오 rest api도 해보자!

export const logout = (req, res) => {
  // 세션을 없앤다
  req.session.destroy();
  return res.redirect("/");
};

// 영상소유주만 form을 보고 제출할 수 있게
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

// 영상 소유주만 수정가능하도록
export const postEdit = async (req, res) => {
  // const {user:{id}} = req.session; == const id = req.session.user.id 
  // const {name, email, username, location} = req.body;
  const {
    // req.session.user에서 현재 로그인된 아이디 얻기
    session: { 
      user: { _id, avatarUrl },
    },
    // edit-profile.pug에서 오는거임
    body: { name, email, username, location },
    file,
  } = req;
  // req.file을 할 수 있는 이유는 userrouter에서 postedit전에 multer를 사용하기 때문
  // db에 파일을 저장하는게 아니라 파일의 위치를 저장
  console.log(file);
  // username이나 email은 업데이트하지 못하게 막아야함
 
  // user를 찾아서 업데이트 해줘야함
  // findByIdAndUpdate가 updatedUser를 주기때문에 req.session.user = updatedUser;를 해주면 됌됌
  // findByIdAndUpdate는 기본적으로 업데이트 되기전의 데이터를 return해줌
  try {
    const updatedUser = await User.findByIdAndUpdate(_id,
      {
        // 유저가 form으로 파일을 보냈다면 file.path를 쓰고 아니면 기존 avatarUrl를 쓴다.
        // form에 파일이 있다면 req에 있는 file object를 사용할 수 있다는 것 -> file.path가 존재한다는 것 
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location,
      },
      // new: true해주면 findByIdAndUpdate가 업데이트된 데이터를 return해줌
      // moongose에게 가장 최근 업데이트된 object를 원한다고 하는것
      { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
  } 
  // username, email은 user.js에서 unique: true임. 그래서 업데이트하려면 에러가 남
  catch (error) {
    return res
      .status(400)
      .render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "This username/email is already taken",
      });
  }
};

export const getChangePassword = (req, res) => {
  // 깃허브 사용자 : 비밀번호가 없어서 비밀번호 변경 불가
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    // 로그인을 한 유저가 누구인지 알아야함. 누구나 알 수 없게 session에서 가져와서 유저가 누군지 알아야함
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  // 비밀번호 변경하기
  user.password = newPassword;
  // 비밀번호 저장은 user.js에서 함
  // save()가 실행될때마다 hash가 일어남 > 미들웨어
  await user.save();
  // 비밀번호 바꾸면 로그아웃됌
  return res.redirect("/users/logout");
};

// 프로필에 들어가면 해당 유저가 올린 영상들을 볼 수 있게
// 영상을 틀면 누가 올렸는지 확인
export const see = async (req, res) => {
  // public으로 만들어야하니까 url에 있는 user id를 가져옴. 
  // session에서 가져오지 않음 왜냐하면 누구나 봐야하니까
  // 누구나 사용자의 프로필을 볼 수 있어야함
  const { id } = req.params;
  // 특정 사용자가 올린 모든 영상을 찾아냄
  // 비디오를 올린사람 (owner id)과 어떤? 사용자(params의 id)가 같으면 사용자의 계정에서 그 사용자가 올린 비디오들을 전부 찾아 보여준다. 
  // const videos = await Video.find({ owner: user._id });
  // populate가 없으면 id만 출력. populate가 있으면 object전체가 불러짐
  const user = await User.findById(id).populate("videos");

  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  // 위에서 찾은 user를 template에 보내주기만 하면 됌
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
    // array니까 include ../mixins/video 해줌
    // videos,
  });
};