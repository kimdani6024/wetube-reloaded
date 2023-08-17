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
    //처음엔 로그인 되어있지 않아서 처음엔 undefiend
    res.locals.loggedInUser = req.session.user;
    next();
}