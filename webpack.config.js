// node에서 제공되는 path 사용하여 OS에 따른 파일경로 이슈를 방지
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // 처음 읽어올 파일
  // 여기서부터 import 되어있는 다른 스크립트를 불러온다.
  entry: [path.join(__dirname, 'server.js')],

  // output은 webpack의 번들링 결과물에 대한 설정
  // path - 디렉터리경로
  // publicPath - 브라우저에서 접근하는 경로
  // fileName - 번들링된 파일명
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  // 서버 실행시 소스 파일들을 번들링 하여 메모리에 올린다.
  // devServer: {
  //   hot: true,
  //   filename: 'bundle.js',
  //   publicPath: '/',
  // },

  // 번들링하는 동안 node_modules 디렉토리의 모든 패키지를 건너 뜁니다.
  // reids 모듈과 호환성 때문에 추가
  externals: [nodeExternals()],
  // 애플리케이션의타겟 환경
  target: 'node',

  // Babel
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: false,
          cacheDirectory: true,
          presets: ["es2015", "stage-2"],
        }
      }
    ]
  }
}
