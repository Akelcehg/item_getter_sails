//var Item = MODEL('item').schema;
var Http = require('./http.js');
var File = require('./file.js');
var ItemConfig = require('./itemConfig');
var FieldHandler = require('./fieldHandler');
var async = require('async');

exports.install = function (options) {
};

exports.uninstall = function (options) {
};

exports.parse = function () {
    console.log('parse');
};

exports.getItemLinks = function (itemsListPage, configFile) {

    var listObject = configFile['items_list'];

    var fieldHandler = new FieldHandler(
        listObject['link_item'],
        listObject['link_attribute'],
        itemsListPage
    );

    return fieldHandler.getFieldValue();

};


exports.parseItems = function (itemLinks) {

    //var item = new Item();  
    // var itemPage = new Http(itemLinks[0]);
    // itemPage.getPageContent(function(err, itemPageContent) {

    /*    var f = new File();
     f.saveFile('/', 'itempage.html', itemPageContent, function() {
     console.log('each done series');
     });*/

    // });

    var f = new File();
    f.getFile('./itempage.html', function (err, page) {


    });

    /*_async.eachSeries(itemLinks, function(itemLink, callback) {

     var itemPage = new Http(itemLink);
     itemPage.getPageContent(function(err,itemPageContent) {

     console.log('each done series');

     callback(err);

     });
     }, function(err) {
     if (err) {
     console.log('Error processing link ' + err);
     } else {
     console.log('All links processed');
     }
     });*/

    /*itemLinks.forEach(function(itemLink, i, arr) {
     async(function*() {
     var itemPage = new Http(itemLink);
     yield sync(itemPage.getPageContent)();
     })();
     })(function(err) {
     if (err) console.log(err);
     });*/


    //get item page
    //load item config file
    //process item page => modify item values
    //save item to db    

    //var user = new Users(self.body);
}

exports.getPageContent = function (itemLink, cb) {
    var page = new Http(itemLink);
    page.getPageContent(function (err, html) {
        cb(err, html);
    });
}

exports.parseSingleItem = function (itemLink, configFile) {
    return true;
}
