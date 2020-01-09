
'use strict'

require('dotenv').config()
var http = require('http')
const express = require('express')
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

const ws = require('express-ws')(app, server)
// additional middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(hook)
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'build')))

const client = octonode.client(process.env.Token)
const repo = client.repo('1dv523/aa224fn-examination-3')

ws.getWss().on('connection', function (ws) {
  if (ws.readyState === 1) {
    console.log('connected')
    repo.issues(function (callback, body, header) {
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
          comments: body[index].comments,
          avatar: body[index].user.avatar_url,
          alerts: 0,
          event: ''
        })
      }
      if (ws.readyState === 1) {
        try {
          ws.send(JSON.stringify({ message: 'list', data: issueList }))
        } catch (err) {
          console.log(err.message)
        }
      }
    })
  }
})
app.ws('', function (ws, req) {
  hook.on('issues', function (repo, data) {
    if (ws.readyState === 1) {
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
        url: data.issue.html_url,
        avatar: data.issue.user.avatar_url,
        alerts: 0,
        event: ''
      }
      try {
        ws.send(JSON.stringify(obj))
      } catch (err) {
        console.log(err.message)
      }
    }
  })
  hook.on('issue_comment', function (repo, data) {
    if (ws.readyState === 1) {
      const obj = {
        message: 'comment',
        action: data.action,
        comments: data.issue.comments,
        number: data.issue.number,
        title: data.issue.title,
        body: data.comment.body,
        user: data.comment.user.login,
        avatar: data.issue.user.avatar_url,
        url: data.issue.html_url,
        alerts: 0,
        event: ''
      }
      try {
        ws.send(JSON.stringify(obj))
      } catch (err) {
        console.log(err.message)
      }
    }
  })
})

hook.on('error', function (err, req, res) {
  if (err) {
    console.log(err)
  }
})
app.get('', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
