var express = require('express'),
    router = express.Router(),
    unirest = require('unirest'),
    db = require('monk')(process.env.MONGOLAB_URI),
    linkedInUsers = db.get('users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    unirest.get('https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address)')
      .header('Authorization', 'Bearer ' + req.user.token)
      .header('x-li-format', 'json')
      .end(function (response) {
        res.render('glazes', { profile: response.body });
      })
  } else {
    res.render('index');
  }
});

module.exports = router;
