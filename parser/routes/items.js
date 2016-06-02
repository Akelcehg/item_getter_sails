var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ItemsList = require(__dirname + '/../models/itemsList').schema;
var Parser = require(__dirname + '/../modules/parser');
var File = require(__dirname + '/../modules/file');

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
    var itemId = req.params.item_id;
    mongoose.model('items_list').findOne({_id: itemId}, function (err, item) {
        if (err || !item) {
            res.render('error');
        } else {
            res.render('item_test', {'item': item});
        }
    });

});

router.post('/test_http', function (req, res, next) {

    var itemId = req.body.itemId, file = new File();

    mongoose.model('items_list').findOne({_id: itemId}, function (err, item) {
        if (!err && item) {
            Parser.getPageContent(item['link'], function (err, page) {

                file.saveFile('./', 'test.html', page, function () {
                    console.log('saved');
                });
                res.json({'status': 'ok'});
            });
        } else res.json({'status': 'fail'});
    });
});


module.exports = router;
