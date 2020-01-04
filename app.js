
'use strict'
const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const logger = require('morgan')
const session = require('express-session')
const app = express()

// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
// additional middleware
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

const sessionOptions = {
  name: 'name of keyboard cat',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}

app.use(session(sessionOptions))
// middleware to be executed before the routes
app.use((req, res, next) => {
  // flash messages - survives only a round trip
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  next()
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

// listen to provided port
app.listen(3000, () => console.log('server is running on http://localhost:3000')
)
