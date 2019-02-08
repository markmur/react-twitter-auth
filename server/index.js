require('dotenv').config()

const path = require('path')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const Twitter = require('passport-twitter').Strategy

const port = process.env.PORT || 8080

passport.use(
  new Twitter(
    {
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: `http://localhost:${port}/auth/twitter/callback`,
    },
    (token, tokenSecret, profile, cb) => {
      return cb(null, profile)
    },
  ),
)

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

const app = express()

app.use(
  session({
    secret: 'you-should-probably-change-this',
    resave: false,
    saveUninitialized: true,
  }),
)

const authenticated = (req, res, next) => {
  if (typeof req.user !== 'object') {
    return res.redirect('/auth/twitter')
  }

  return next()
}

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'build')))
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login-error' }),
  (req, res) => {
    // Successful authentication, redirect
    return res.redirect('/')
  },
)

app.get('/login-error', (req, res) => res.send('Failed to login'))

app.get('/profile', (req, res) => res.json(req.user))

app.get('/', authenticated, (req, res) => {
  return res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, () => {
  console.log(`[Server] Listening on http://localhost:${port}`)
})
