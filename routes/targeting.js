var express = require('express');
var router = express.Router();

const targetingController = require('../controllers').targeting_controller;

router.get('/', function(req, res){  
    targetingController.getAllowedCampaigns(req, res);
})

module.exports = router;