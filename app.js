/* Mongo DB */

/* dotenv */
require('dotenv').config();

/* Mongo DB 사용에 필요한 변수 */
const { MongoClient } = require("mongodb");
const url = process.env.DB_URL;  // .env 파일에서 API key 불러오기
const client = new MongoClient(url);


/* Express */

/* express 사용에 필요한 변수 */
const express = require('express');
const app = express();
const port = 3000;  // 사용할 포트 번호

/* 템플릿 엔진으로 pug 사용 */
app.set('view engine', 'pug');

/* 클라이언트의 fetch(body) 요청 해석 */
app.use(express.urlencoded({extended: true}));  // form으로 전달 받은 값 인코딩
app.use(express.json());  // JSON 데이터 해석

/* 라우팅 */


/* 웹서버 포트 지정 */
app.listen(port, () => {
  console.log(`To-Do app listening on port ${port}`);
});