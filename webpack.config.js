// 이 파일이 하는 일은 코드에 따라 변형을 시키기 위함


// style-loader이라는 loader를 사용하면, javascript코드가 css파일을 읽는데,
// 우리는 css파일 따로, js파일 따로 웹팩으로 번들화 시키고싶다. 한번에 할 경우 js 로딩을 기다려야하기 때문이다.
// 그래서 MiniCssExcractPlugin.loader를 사용한다.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// webpack이 읽을 configuration 파일을 내보냄
const path = require("path")

const BASE_JS = "./src/client/js/";

module.exports = {
    // 소스코드. 우리가 변경하고자 하는 파일 경로를 입력함
    // 시작코드
    entry: {
        main: BASE_JS + "main.js",
        videoPlayer: BASE_JS + "videoPlayer.js",
        recorder: BASE_JS + "recorder.js",
        commentSection: BASE_JS + "commentSection.js",
    },
    // 결과물을 어떤 파일이름으로 어디에 저장할지도 지정해주기
    mode: 'development',
    // 명령어 실행 없이 계속 webpack실행
    watch: true,
    plugins: [
        new MiniCssExtractPlugin({
            // 이 파일은 output 디렉토리로 향하게 됌
          filename: "css/styles.css",
        }),
      ],
    output: {
        // 각각을 서로 다른 디렉토리로 보낼 수 있음
        // 시작점 assets/js/main.js임
        // 연결 : base.pug
        // [name]은 entry에 있는 이름 가져감:main, videoPlayer
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        // assets자동삭제 하도록
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    // 웹팩이 자바스크립트 코드를 감지하면 바벨을 이용해서 처리
                    // 바벨을 웹팩안에 위치시킴
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", {targets: "defaults"}]],
                    },
                },
            },
            {
                // client-main.js가 scss파일을 import하고 있고 웹팩이 해당내용을 어떻게 처리해야할지 알려줘야함
                test: /\.scss$/,
                // 모든 scss파일들은 우선 sass-loader에 의해 css로 처리되도록 함
                // 그런다음 그걸 css-loader로 넘겨 진행중인 모든 import들을 처리함
                // 마지막에는 MiniCssExtractPlugin을 처리함 > css로 컴파일된 코드를 css/styles.css에 입력해줌 > 모듈안에 plugins 참고
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
              },
        ],
    },
};

