"use strict"

const passport = require("passport");
const session = require("express-session");
const TotpStrategy = require("passport-totp").Strategy;
const base32 = require("thirty-two");
const LocalStrategy = require("passport-local").Strategy;

/**
 * Helper function to initialize passport authentication with the LocalStrategy
 * 
 * @param app express app
 * @param db instance of an active Database object
 */
function initAuthentication(app, db) {
  // Setup passport
  passport.use(new LocalStrategy((username, password, done) => {
    db.authUser(username, password)
      .then(user => {
        if (user) done(null, user);
        else done({ status: 401, msg: "Incorrect username and/or password" }, false);
      })
      .catch(err => /* db error */ { console.log(err); done({ status: 500, msg: "Database error" }, false) });
  }));

  passport.use(new TotpStrategy(
    function (user, done) {
      // In case .secret does not exist, decode() will return an empty buffer
      return done(null, base32.decode(user['SECRET']), 30);  // 30 = period of key validity
    })
  );

  // Serialization and deserialization of the user to and from a cookie
  passport.serializeUser((user, done) => {
    done(null, user['ID']);
  });
  passport.deserializeUser((id, done) => {
    db.getUser(id)
      .then(user => done(null, user))
      .catch(e => done(e, null));
  });

  // Initialize express-session
  app.use(session({
    secret: "8c74610671de0ef9662191586e60fdeb6f34186ae165a0cea7ee1dfa4105354e",
    resave: false,
    saveUninitialized: false
  }));

  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
}

/**
 * Express middleware to check if the user is authenticated.
 * Responds with a 401 Unauthorized in case they're not.
 */
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'Not authenticated'});
}

function isTotp(req, res, next) {
  if(req.session.method === 'totp')
    return next();
  return res.status(401).json({ error: 'Missing TOTP authentication'});
}

module.exports = { initAuthentication, isLoggedIn, isTotp };