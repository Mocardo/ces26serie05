const { json } = require('express');
const express = require('express')
      , fs = require('fs')
      ;

const app = express();
const port = 3001;

app.use(express.json())

app.post('/api/formdata', (req, res) => {
  // Filtering json input
  const acceptedFields = ['nome', 'endereco', 'dataNasc']
  const filteredObject = {}
  for(let field of acceptedFields) {
    filteredObject[field] = req.body[field]
  }

  console.log(`POST /api/formdata: received ${JSON.stringify(filteredObject)}`)

  // Saving in db
  const content = fs.readFileSync('db.json')
  const dbArray = JSON.parse(content)
  dbArray.push(filteredObject)
  fs.writeFile('db.json', JSON.stringify(dbArray), function(err){
    if(err) throw err;
  })

  res.status(204).end();
})

app.get('/api/formdata', (req, res) => {
  console.log(`GET /api/formdata`)
  const content = fs.readFileSync('db.json')
  res.send(content)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
