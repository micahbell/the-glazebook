var express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback',
  passport.authenticate('linkedin', {
    failureRedirect: '/',
    successRedirect: '/'
  }));

// router.get('/google',
//   passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));
//
// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   // passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/glazes');
//     // res.redirect('/');
//   });

router.get('/logout', function (req, res, next) {
  req.session = null
  res.redirect('/')
});

module.exports = router;
