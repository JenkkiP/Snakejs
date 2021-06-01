const { request, response, json } = require('express');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('snake.db');

const app = express();



app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/',(request, response) =>{
  response.render('index')
});

app.get('/scores', (request, response)=>{
  let sql = 'SELECT * FROM snake ORDER BY score DESC LIMIT 15';
  db.all(sql,(err, rows)=>{
    if(err){
      console.log(err)
    }
    response.render('scores', {
      highscore: rows
    });
  })
  
})
app.post('/save', (request, response )=>{
  score = request.body
  console.log(score)
  let sql = `INSERT INTO snake(name, score) VALUES('${score.nickname}', ${score.score})`
  db.run(sql, (err  )=>{
    if(err){
      console.log(err)
    }
    else console.log('saved')
  })
  response.render('index');
});



/*

app.get('/', (request, response) => {
  let sql = "SELECT * FROM quotes ORDER BY id DESC LIMIT 10";
  // "ORDER BY id DESC LIMIT 10"
  //let i = 0
  db.all(sql, (error, rows) => {
    response.render('index', {
      quotes: rows
    });
    console.log(rows)
  });
});




app.post('/', (request, response) => {
  const name = request.body.namn;
  const quote = request.body.quote;
  console.log(quote)
  console.log(name)

  const sql = `
    INSERT INTO quotes(name, quote)
    VALUES('${name}', '${quote}')
  `;

  db.run(sql, () => {
    response.redirect('/')
    response.end();
  });
});

//SQL.min() ger minsta värdet

*/

app.listen(3000);