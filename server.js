const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose')
const todoRoutes = require('./routes/todos');
const { Router } = require('express');

const app = express();
const dbURI = 'mongodb+srv://root:60618495Ro%21@ronnen-test.md2vp.mongodb.net/todos?retryWrites=true&w=majority'
//root:password@db-name...../collectionname?.....

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to db')
    app.listen(process.env.PORT || 5600, () => console.log('server running'));
    })
    // process.env.PORT allows services like heroku run the server with their port, or the user to run PORT=XYZW node index.js and run it with a selected port
  .catch(error => {
    console.log(error)
  })

/*
Middleware - methods/functions/operations that are called BETWEEN processing the Request and sending the Response in your application method.
*/

app.use(morgan('dev')) // gives more detauls regarding API calls, e.g 'POST /todos/api/ 200 161.327 ms - 158'

// body-parsers: used for POST and PUT requests, allowing express to recognize json  or string/arrays sent
// to the DB
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view enjine used is ejs, allows html rendering with js script (and if needed using variables sent from node)
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('index');
})

app.use('/todos', todoRoutes) // get todos, post todo, change todo, delete todo