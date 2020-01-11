'use strict'
require('dotenv').config()
var http = require('http')
const express = require('express')
const path = require('path')
const logger = require('morgan')
var bodyParser = require('body-parser')
const WebSocket = require('ws')
const hookHandler = require('./controllers/hookHandler')
const GithubHook = require('express-github-webhook')
const app = express()
const hook = GithubHook({ path: '/webhook', secret: process.env.Token })
const PORT = process.env.PORT || 3000
const server = http.createServer(app).listen(PORT, function () {
  console.log('Started: listing on port', PORT)
})
const wss = new WebSocket.Server({ server })
// additional middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(hook)
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
wss.on('connection', function connection (ws) {
  console.log('connected')
  hookHandler.sendIssues(ws)
  hook.on('issues', function (repo, data) {
    hookHandler.send('issues', data, ws)
  })
  hook.on('issue_comment', function (repo, data) {
    hookHandler.send('issue_comment', data, ws)
  })
  ws.on('close', function connection (ws) {
    console.log('disconnected')
  })
})
hook.on('error', function (err, req, res) {
  if (err) {
    console.log(err)
  }
})
