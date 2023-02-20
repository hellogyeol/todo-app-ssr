/* Mongo DB */

/* dotenv */
require('dotenv').config();

/* Mongo DB 사용에 필요한 변수 */
const { MongoClient } = require("mongodb");
const url = process.env.DB_URL;  // .env 파일에서 API key 불러오기
const client = new MongoClient(url);


/* Express */

/* express 사용에 필요한 변수 */
const methodOverride = require('method-override');
const express = require('express');
const app = express();
const port = 3000;  // 사용할 포트 번호

/* 템플릿 엔진으로 pug 사용 */
app.set('view engine', 'pug');

/* 클라이언트의 fetch(body) 요청 해석 */
app.use(express.urlencoded({extended: true}));  // form으로 전달 받은 값 인코딩
app.use(express.json());  // JSON 데이터 해석
app.use(methodOverride('_method'));

/* 라우팅 */
app.get('/', (req, res) => {
  renderToDoList(res);
});

app.post('/', (req, res) => {
  clearToDoList(res);
});

/* 웹서버 포트 지정 */
app.listen(port, () => {
  console.log(`To-Do app listening on port ${port}`);
});

/* 함수 선언 */

/**
 * To-Do 목록 조회 함수.
 * DB에서 목록을 조회 후 클라이언트에게 전달
 */
async function renderToDoList(res) {
  await client.connect();
  const col = client.db('ssrDb').collection('ssrCol');
  const todoList = await col.find({}).toArray();
  console.log(todoList);

  res.render('index', {
    todoList: todoList
  });
}

async function clearToDoList(res) {
  await client.connect();
  const col = client.db('ssrDb').collection('ssrCol');
  await col.deleteMany({})
  const todoList = await col.find({}).toArray();

  res.send(todoList);
}