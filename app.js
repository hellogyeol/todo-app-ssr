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

/* 라우팅 */
app.get('/', (req, res) => {
  renderToDoList(res);
});

app.post('/', (req, res) => {
  addToDo(req, res);
});

app.get('/clear', (req, res) => {
  clearToDoList(res);
});

app.post('/todo/del', (req, res) => {
  deleteToDo(req, res);
});

/* 웹서버 포트 지정 */
app.listen(port, () => {
  console.log(`To-Do app listening on port ${port}`);
});


/* 함수 선언 */

/**
 * To-Do 목록 조회 함수.
 * DB에서 목록을 조회 후 동적 변수와 함께 pug 파일 렌더링
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

/**
 * To-Do 목록 초기화 함수.
 * DB에서 목록을 초기화한 후 동적 변수와 함께 pug 파일 렌더링
 */
async function clearToDoList(res) {
  await client.connect();
  const col = client.db('ssrDb').collection('ssrCol');
  await col.deleteMany({});
  const todoList = await col.find({}).toArray();
  console.log(todoList);

  res.render('index', {
    todoList: todoList
  });
}

/**
 * To-Do 생성 함수.
 * 새로운 To-Do를 DB에 추가 후 동적 변수와 함께 pug 파일 렌더링
 */
async function addToDo(req, res) {
  await client.connect();
  const col = client.db('ssrDb').collection('ssrCol');
  await col.insertOne({
    id: String(Date.now()),
    content: req.body.content
  });
  const todoList = await col.find({}).toArray();
  console.log(todoList);
  
  res.render('index', {
    todoList: todoList
  });
}

/**
 * To-Do 삭제 함수.
 * 선택한 To-Do의 HTML 요소 ID와 일치하는 ID를 가진 항목을 DB에서 삭제 후
 * 동적 변수와 함께 pug 파일 렌더링
 */
async function deleteToDo(req, res) {
  await client.connect();
  const col = client.db('ssrDb').collection('ssrCol');
  await col.deleteOne({
    id: req.body.id
  });
  const todoList = await col.find({}).toArray();
  console.log(todoList);
  
  res.render('index', {
    todoList: todoList
  });
}