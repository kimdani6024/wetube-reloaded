// style-loader이라는 loader를 사용하면, javascript코드가 css파일을 읽는데,
// 우리는 css파일 따로, js파일 따로 웹팩으로 번들화 시키고싶다. 한번에 할 경우 js 로딩을 기다려야하기 때문이다.
// 그래서 MiniCssExcractPlugin.loader를 사용한다.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// webpack이 읽을 configuration 파일을 내보냄
const path = require("path")

module.exports = {
    // 소스코드. 우리가 변경하고자 하는 파일 경로를 입력함
    // 시작코드
    entry: "./src/client/js/main.js",
    // 결과물을 어떤 파일이름으로 어디에 저장할지도 지정해주기
    mode: 'development',
    // 명령어 실행 없이 계속 webpack실행
    watch: true,
    plugins: [
        new MiniCssExtractPlugin({
          filename: "css/styles.css",
        }),
      ],
    output: {
        // 각각을 서로 다른 디렉토리로 보낼 수 있음
        // 시작점 client/js/main.js임
        filename: "js/main.js",
        path: path.resolve(__dirname, "assets"),
        // assets자동삭제 하도록
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", {targets: "defaults"}]],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
              },
        ],
    },
};

