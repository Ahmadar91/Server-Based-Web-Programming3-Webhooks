
'use strict'

var http = require('http')
const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const logger = require('morgan')
var bodyParser = require('body-parser')
const app = express()

require('dotenv').config()
const GithubHook = require('express-github-webhook')
const hook = GithubHook({ path: '/webhook' })
const PORT = 3000
const server = http.createServer(app).listen(PORT, function () {
  console.log('Started: listing on port', PORT)
})

// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
// additional middleware

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(hook)
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))

hook.on('issues', function (repo, data) {
  // console.log(data)
  const data1 = JSON.parse(data.payload)
  console.log('data1')
  console.log(data1)
  console.log(data1.action)
  console.log(data1.issue.title)
  console.log(data1.issue.comments)
})
hook.on('error', function (err, req, res) {
  if (err) {
    console.log(err)
  }
})

// routes
// app.use('/', require('./routes/homeRouter'))

// catch 404
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})
// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.sendFile(path.join(__dirname, 'public', '500.html'))
})
