import express from "express";

const PORT = 3000;
const app = express();

const URLLogger = (req,res,next) => {
    console.log("path: %s", req.path);
    next()
};

const TimeLogger = (req,res,next) => {
    const now = new Date();	// 현재 날짜 및 시간
    const year = now.getFullYear();	// 연도
    const month = now.getMonth(); //월
    const date = now.getDate();	// 일
    console.log("Time:", year,month,date);
    // console.log('Time: %d', `${year}.${month}.${month}`);
    next();
};

const SecurityLogger = (req,res,next) => {
    const protocol = req.protocol;
    // console.dir(protocol)
    // console.log(protocol);
    if (protocol === "https") {
        console.log("secure")
    }
    else {
        console.log("Insecure")
    }
    next()
};

const ProtectorLogger = (req, res, next) => {
    const url = req.url;
    if (url === "/protected") {
        return res.end();
    }
    next();
  };
  
app.use(URLLogger, TimeLogger, SecurityLogger, ProtectorLogger)
app.get("/", (req, res) => res.send("<h1>Home</h1>"));
app.get("/protected", (req, res) => res.send("<h1>Protected</h1>"));


// Codesandbox gives us a PORT :)
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)
