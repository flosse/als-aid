const _ = require('lodash');
const passport = require('passport');
const request = require('request');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ id: id })
    .catch((err) => {
      done(err);
    })
    .then((user) => {
      done(null, user);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() })
    .catch((err) => done(null, false, { msg: `Email ${email} not found.` }))
    .then((user) => {
      user.comparePassword(password, (err, isMatch) => {
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { msg: 'Invalid email or password.' });
      });

    });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Signin Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/signin");
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

/**
 * Must be admin middleware.
 */
exports.isAdmin = (req, res, next) => {
  if (req.user.isAdmin() === false) {
    res.redirect("/auth/signin");
  }

  return next();
};