# express + webpack(middleware)
- 웹팩을 미들웨어로 서버 측에서 사용하는 예제

## React install 참조
- https://facebook.github.io/react/docs/installation.html
- npm 보다 yarn을 권장.

## 버젼
- nodejs v6.11.0
- react v15.6.1

## global package install
- npm install -g express-generator or yarn global add express-generator
- npm install pm2@latest -g

## Create Express App
- express '프로젝트 폴더명'
- npm install or yarn

## 폴더 및 파일 설명

### 폴더
- public: express 정적 파일 서비스 하는 부분 (현재 프로젝트엔 필요없다. 클라이언트 따로 존재함) => 보안에 관련된 자료드는 퍼블릭에 담으면 안됨.
- routes: express routes 파일 모음
- conf: 라우터 및 mysql 정보, 전역 변수
- views: 템플릿 엔진인 jade (HTML 문법을 보다 약식으로 해주는 것이라고 생각하면 됨)
- middlewares: JWT 방식 미들 웨어
- models: mySql 및 redis 엑세스하는 함수
- modules: 자주 사용되는 함수
- dist: babel로 서버 측 코드 ES6 -> ES5 번역 (상품화)
- test: mocha 설정 파일

### 파일
- .babelrc: 바벨 프리셋과 플러그인 설정.
- server.js: 서버 실행 시 첫 로드 파일
- app.js: server.js 파일에서 app.js 를 로드 한다. 서버단에 첫시작 부분 이라고 생각하면됨
- webpack.config.js: webpack 설정

## Start Up
- nodemon ./server.js --exec babel-node localhost

## script 명령어 설명
- start: nodemon은 server.js 를 실행하는데 babel-node도 함께 사용하면서 서버 실행. 코드가 변경되면 서버 자동 재시작
- build: 전체코드 ES6 -> ES5 컴파일 (제품화)
- serve: 프로덕트 서버 테스트 port 3002
- test : 유닛 테스트 BDD와 TDD방식 둘다 사용 할수 있음 (test/index.js 설정 파일)
- clean: build파일 dist 폴더 삭제
- pm2  : pm2에 서버 등록

## 사용 중인 모듈 및 미들 웨어
- nodemon: 서버 코드가 변경 될 때 마다 서버 재시작
- babel: ES7 문법을 ES5 번역
- redis: 메모리 NoSql
- morgan: 웹 요청이 들어왔을 때 로그를 출력
- jsonwebtoken: JWT 토큰 쉽게 생성
- path: 파일 경로를 다루는 함수 제공 (nodejs)
- express-session: express 프레임우크 내에서 session을 다루는 함수 제공 (쿠키도 제공한다.)
- cookie-parser: 쿠키를 추출하는 미들웨어
- body-parser: POST 요청 데이터를 추출하는 미들웨어
- mocha: JavaScript Testing Framework
- moment: 시간 관련 라이브러리
- webpack-dev-middleware: 웹팩을 미들웨어로 사용 가능하게 개발자 모드에서만 사용하는걸 권장.
- webpack-node-externals: 웹팩으로 번들 하지 않아도 사용되는 외부 모듈을 쉽게 정의해주는 도구. (webpack.config.js에 사용됨)

## 참고 사이트
- http://expressjs.com/ko/
- https://github.com/babel/example-node-server
- https://github.com/NodeRedis/node_redis

## mocha 참고 사이트
- http://inspiredjw.com/entry/Mocha-%EB%A1%9C-%ED%95%98%EB%8A%94-API-Testing
- https://blog.outsider.ne.kr/770

## Fifty Bridge License
See the LICENSE file.
