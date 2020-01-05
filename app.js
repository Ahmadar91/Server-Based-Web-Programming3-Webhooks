
'use strict'
var bodyParser = require('body-parser')

const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const logger = require('morgan')
const app = express()
require('dotenv').config()
const GithubHook = require('express-github-webhook')
const hook = GithubHook({ path: '/webhook', secret: process.env.TOKEN })

// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
// additional middleware
app.use(hook) // use our middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/', require('./routes/homeRouter'))

// use for localhost
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

// listen to provided port
app.listen(3000, () => console.log('server is running on http://localhost:3000')
)
