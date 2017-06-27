var express = require('express');
var router = express.Router();
 
var matching_route = require('./matching');
router.use('/matching', matching_route);
 
//API start
router.get('/', function(req, res) {
  res.status(200).send({
    message: 'Bienvenido al API de su Microservicio',
  });
});
 
module.exports = router;