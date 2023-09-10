import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";

const s3 = new aws.S3({
  region: "ap-northeast-2",
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  });


const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "daniwetube/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "daniwetube/videos",
  acl: "public-read",
});


//lovals에 로그인한 사용자를 추가
//우리의 pug이 누가 로그인 했는지 알 수 있음

export const localsMiddleware = (req,res,next) => {
    //사용자가 로그인되면 res.locals.loggedIn = True가 되서 이것을 확인하려고
    //값이 False이거나 undefined일 수 있으니 boolean으로 True이거나 False인지 확인
    //locals는 res에 있고 session은 req에 있음
    //res.locals를 통해서 session의 데이터를 pug로 보낼때 연결해주는 역할
    //session -> res.locals -> pug
    res.locals.loggedIn = Boolean(req.session.loggedIn)
    res.locals.siteName="Wetube";
    //처음엔 로그인 되어있지 않아서 처음엔 undefiend 그래서 또는 {}을 씀
    //현재 로그인된 사용자를 알려줌
    res.locals.loggedInUser = req.session.user || {};
    next();
}


export const protectorMiddleware = (req, res, next) => {
    // 유저가 로그인 되어 있으면 요청을 계속함
    if (req.session.loggedIn) {
      return next();
    } else {
      req.flash("error", "Log in first.");
    // 사용자가 로그인이 안되있으면, 로그인페이지로 가게 만듬
      return res.redirect("/login");
    }
  };
  
  // 로그인 되어 있지 않은 사람만 접근 가능
  export const publicOnlyMiddleware = (req, res, next) => {
    // 유저가 로그인 되어 있지 않으면 요청을 계속함
    if (!req.session.loggedIn) {
      return next();
    } else {
      req.flash("error", "Not authorized");
    // 로그인이 되어 있으면 홈으로 가게 만듬
      return res.redirect("/");
    }
  };

  // 사용자가 보낸 파일을 uploads 풀더에 저장
  // 컨트롤러에 파일정보 전송
  export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
      // https://www.npmjs.com/package/multer
      // 용량 : byte기준임
      fileSize: 3000000,
    },
    storage: s3ImageUploader,
  });
  export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
      fileSize: 10000000,
    },
    storage: s3VideoUploader,
  });