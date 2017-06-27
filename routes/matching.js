var express = require('express');
var router = express.Router();

const matchingController = require('../controllers').matching_controller;

router.get('/:campaign', function(req, res){  
    console.log('route /:campaign reached');
    matchingController.getAdvertisers(req, res);
})

module.exports = router;