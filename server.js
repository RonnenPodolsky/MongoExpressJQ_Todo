const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose')
const todoRoutes = require('./routes/todos');
const { Router } = require('express');

const app = express();
const dbURI = 'mongodb+srv://root:60618495Ro%21@ronnen-test.md2vp.mongodb.net/ronnen-test?retryWrites=true&w=majority'

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('connected to db')
    app.listen(process.env.PORT || 5600, () => console.log('server running'));
})
  .catch((error) => {
    console.log(error)
  })

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('index');
})

app.use('/todos', todoRoutes)
//