var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = require('../models/users').schema;
var AttributesGroups = require('../models/attributesGroups').schema;


/* GET home page. */
router.get('/', function (req, res, next) {
    var u = new User();
    u.email ='testemail';
    u.testing();
    mongoose.model('users').find(function (err,data) {
        console.log (data);
    }).select('email -_id');
    /*var ag = new AttributesGroups({
        group_name : 'testname',
        is_possible : false,
        attributes : ['1','2','3']
    });

    ag.save(function (err) {
        console.log (err);
    })*/
    res.render('index', {title: 'Express updated'});
});

module.exports = router;
