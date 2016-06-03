var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async'),
    ItemsList = require(__dirname + '/../models/itemsList').schema,
    Parser = require(__dirname + '/../modules/parser'),
    File = require(__dirname + '/../modules/file'),
    ItemConfig = require(__dirname + '/../modules/itemConfig'),
    ItemHandler = require(__dirname + '/../modules/itemHandler');

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

router.post('/test_links', function (req, res, next) {

    var itemId = req.body.itemId;

    async.waterfall([
        function (callback) {
            mongoose.model('items_list').findOne({_id: itemId}, function (err, item) {
                callback(err, item);
            });
        },
        function (item, callback) {
            if (item) {
                var itemConfigFile = new ItemConfig(item['config_file']);
                itemConfigFile.getConfigFile(function (err, configFile) {
                    callback(err, configFile, item)
                });
            } else {
                callback('No items');
            }
        },
        function (configFile, item, callback) {
            Parser.getPageContent(item['link'], function (err, page) {
                console.log('Page recieved ' + page.length);
                var parsedLinks = Parser.getItemLinks(page, configFile);
                callback(err, {'status': 'ok', 'links': parsedLinks});
            });
        }

    ], function (err, result) {
        if (err) {
            console.log('Item parse page error ' + err);
            res.json({'status': 'fail'});
        } else {
            res.json(result);
        }
    });
});


module.exports = router;
