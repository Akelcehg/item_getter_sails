var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ItemsList = require('../models/itemsList').schema;

router.get('/', function (req, res, next) {

    var itemsList = new ItemsList();

    itemsList.getAllItems(function (err, items) {
        if (err) {
            res.render('error');
        } else {
            res.render('items_list', {'items': items});
        }
    });
});

router.get('/test/:item_id', function (req, res, next) {
    //console.log (req.params.item_id);
    res.render('item_test');
});

module.exports = router;
