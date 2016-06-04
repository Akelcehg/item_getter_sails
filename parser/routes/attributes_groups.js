var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    AttributesGroups = require('../models/attributesGroups').schema;

router.get('/', function (req, res, next) {

    res.render('attributes_groups');
});

module.exports = router;
