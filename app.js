
'use strict'

require('dotenv').config()
var http = require('http')
const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const logger = require('morgan')
var bodyParser = require('body-parser')
const app = express()
const octonode = require('octonode')
const GithubHook = require('express-github-webhook')
const hook = GithubHook({ path: '/webhook', secret: process.env.Token })

const PORT = process.env.PORT || 3000

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
const ws = require('express-ws')(app, server)
// additional middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(hook)
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))

const client = octonode.client(process.env.Token)
const repo = client.repo('1dv523/aa224fn-examination-3')

ws.getWss().on('connection', function (ws) {
  console.log('connected')
  repo.issues(function (callback, body, header) {
    console.log(body)

    const issueList = []
    for (let index = 0; index < body.length; index++) {
      issueList.push({
        title: body[index].title,
        url: body[index].html_url,
        number: body[index].number,
        user: body[index].user.login,
        body: body[index].body,
        created: body[index].created_at,
        updated: body[index].updated_at,
        comments: body[index].comments
      })
    }
    ws.send(JSON.stringify({ message: 'list', data: issueList }))
  })
})
app.ws('', function (ws, req) {
  hook.on('issues', function (repo, data) {
    console.log(data)

    const obj = {
      message: 'update',
      action: data.action,
      title: data.issue.title,
      comments: data.issue.comments,
      number: data.issue.number,
      body: data.issue.body,
      created: data.issue.created_at,
      updated: data.issue.updated_at,
      user: data.issue.user.login,
      url: data.issue.html_url
    }
    ws.send(JSON.stringify(obj))
  })
  hook.on('issue_comment', function (repo, data) {
    const obj = {
      message: 'comment',
      action: data.action,
      comments: data.issue.comments,
      number: data.issue.number,
      title: data.issue.title,
      body: data.comment.body,
      user: data.comment.user.login
    }
    ws.send(JSON.stringify(obj))
  })
})

hook.on('error', function (err, req, res) {
  if (err) {
    console.log(err)
  }
})
// routes
app.use('/', require('./routes/homeRouter'))

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
