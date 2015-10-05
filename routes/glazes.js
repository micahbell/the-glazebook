var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('glazes/index');
});


module.exports = router;
