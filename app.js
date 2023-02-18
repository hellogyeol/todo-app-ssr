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
app.get('/', (req, res) => {
  renderToDoList(res);
});

app.delete('/', (req, res) => {
  clearTodoList(res);
});

app.post('/todo', (req, res) => {
  addTodo(req, res);
});

app.delete('/todo', (req, res) => {
  deleteTodo(req, res);
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

/**
 * To-Do 목록 초기화 함수.
 * DB에서 목록을 초기화한 후 클라이언트에게 전달
 */
async function clearTodoList(res) {
  await client.connect();
  const col = client.db('ssrDb').collection('ssrCol');
  await col.deleteMany({})
  const todoList = await col.find({}).toArray();

  res.render('index', {
    todoList: todoList
  });
}

/**
 * To-Do 생성 함수.
 * 새로운 To-Do를 DB에 추가 후 전체 목록을 클라이언트에게 전달
 */
async function addTodo(req, res) {
  await client.connect();
  const col = client.db('ssrDb').collection('ssrCol');
  await col.insertOne({
    id: String(Date.now()),  // 현재 시각의 타임스탬프를 고유 ID로 설정
    content: req.body.content  // form으로 전달 받은 사용자 입력값
  });
  const todoList = await col.find({}).toArray();

  res.render('index', {
    todoList: todoList
  });
}

/**
 * To-Do 삭제 함수.
 * 선택한 To-Do의 HTML 요소 ID와 일치하는 ID를 가진 항목을 DB에서 삭제 후
 * 전체 목록을 클라이언트에게 전달
 */
async function deleteTodo(req, res) {
  await client.connect();
  const col = client.db('ssrDb').collection('ssrCol');
  await col.deleteOne({id: req.body.id});  // 해당 ID를 가진 To-Do 삭제
  const todoList = await col.find({}).toArray();

  res.render('index', {
    todoList: todoList
  });
}