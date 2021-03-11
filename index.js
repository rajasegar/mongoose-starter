const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pug = require('pug');

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

const Cat = mongoose.model('Cat', { name: String });

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {

});

const app = express();

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const PORT = process.env.port || 3000;


app.get('/', async (req, res) => {
  const cats = await Cat.find();
  res.render('index', { cats });
});

app.post('/cats', async (req, res) => {
  const { name } = req.body;

  const kitty = new Cat({name});
  await kitty.save();
  const cats = await Cat.find();
  const template = pug.compileFile('views/includes/cat.pug');
  const markup = template({ name });
  res.send(markup);
});

app.delete('/cats/:id', async (req, res) => {
  const { id } = req.params;
  await Cat.deleteOne({ _id: id });
  res.send('success');
});

app.listen(PORT);
console.log('Listening on port: ' + PORT);
