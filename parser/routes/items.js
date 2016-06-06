var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async'),
    ItemsList = require(__dirname + '/../models/itemsList').schema,
    Items = require(__dirname + '/../models/items').schema,
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
                var cheerioParsedPage = Parser.getParsedHttpPage(page);
                var parsedLinks = Parser.getItemLinks(cheerioParsedPage, configFile);
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

router.get('/parse', function (req, res, next) {

    var queryObject = {
        link: req.query.link || '',
        config_file: req.query.config_file || ''
    };

    if (queryObject.link && queryObject.config_file) {
        parseItem(queryObject, function (err, result) {
            if (err) {
                console.log('Item parse page error ' + err);
                res.json(result);
            } else {
                res.render('item_parse', result);
            }
        });
    } else {
        mongoose.model('items_list').find(function (err, itemsList) {
            if (err || !itemsList) {
                res.render('404');
            } else {
                //res.render('/item_test', {'item': item});
                res.render('item_parse', {items: itemsList, queryObject: queryObject, jsonObject: {}});
            }
        });
    }
});

function parseItem(queryObject, cb) {
    var file = new File();
    async.waterfall([
        function (callback) {
            mongoose.model('items_list').find(function (err, itemsList) {
                callback(err, itemsList);
            });
        },
        function (itemsList, callback) {
            var itemConfigFile = new ItemConfig(queryObject.config_file);
            itemConfigFile.getConfigFile(function (err, configFile) {
                callback(err, configFile, itemsList)
            });
        },
        function (configFile, itemsList, callback) {
            file.getFile('./item_page_saved/' + queryObject.config_file + '.html', function (err, pageFile) {
                callback(null, pageFile, configFile, itemsList);
            });
        },
        function (pageFile, configFile, itemsList, callback) {
            if (pageFile) {

                var itemObject = new ItemHandler(configFile['item_fields'], Parser.getParsedHttpPage(pageFile));

                itemObject.getItemAttributes();
                itemObject.processPossibleValues(function () {

                    /////save item
                    var currentItem = new Items({
                        link: queryObject.link,
                        name: 'dasdas',
                        attributes: itemObject.returnItemAttributes()
                    });

                    currentItem.save(function (err) {

                        if (err) console.log (err);

                        callback(null, {
                            'items': itemsList,
                            'jsonObject': itemObject.returnItemAttributes(),
                            queryObject: queryObject

                        });
                    });
                });
            } else {
                Parser.getPageContent(queryObject.link, function (err, page) {


                    var cheerio = require('cheerio');
                    var $ = cheerio.load(page, {
                        normalizeWhitespace: true
                    });
                    $('script').remove();
                    $('style').remove();
                    $('meta').remove();

                    page = $.html();

                    file.saveFile('./item_page_saved/', queryObject.config_file + '.html', page, function () {

                        if (err || !page) {
                            callback(err, {'status': 'fail'});
                        } else {
                            var itemObject = new ItemHandler(configFile['item_fields'], Parser.getParsedHttpPage(page));
                            itemObject.getItemAttributes();
                            itemObject.processPossibleValues(function () {
                                callback(err, {
                                    'items': itemsList,
                                    'jsonObject': itemObject.returnItemAttributes(),
                                    queryObject: queryObject
                                });
                            });
                        }
                    });
                });
            }
        }
    ], function (err, result) {
        cb(err, result);
    });
}

module.exports = router;
