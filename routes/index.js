var express = require('express');
var router = express.Router();
 
var targeting_route = require('./targeting');
router.use('/targeting', targeting_route);
 
//API start
router.get('/', function(req, res) {
  res.status(200).send({
    message: 'Bienvenido al API de su Microservicio',
  });
});
 
module.exports = router;