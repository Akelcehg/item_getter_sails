//var Item = MODEL('item').schema;
var Http = require('./http.js');
var File = require('./file.js');
var ItemConfig = require('./itemConfig');
var FieldHandler = require('./fieldHandler');
var cheerio = require('cheerio');
var async = require('async');

var ItemsList = require('../models/itemsList').schema;    
var Items = require(__dirname + '/../models/items').schema;
var ItemHandler = require(__dirname + '/../modules/itemHandler');

exports.getItemLinks = function (itemsListPage, configFile) {

    var listObject = configFile['items_list'];

    var fieldHandler = new FieldHandler(
        listObject['link_item'],
        listObject['link_attribute'],
        itemsListPage
        );
    
    var links = fieldHandler.getFieldValue();
    
    
    //add domains to lins if dont have
    var updatedLinks = links.map(function(link) {
        if  (link == undefined) {            
            links.splice(links.indexOf(link), 1);
        } else {
            if(link.indexOf(listObject['domain']) == -1) {
                return listObject['domain'] + link;
            } else return link;
        }
    });

    //return fieldHandler.getFieldValue();
    return updatedLinks;
};

exports.processLink = function(link,configFile,cb){    
    var self = this;    
    //get link page content    
    self.getPageContent(link,function(err,page){        
        if (!err){
            var parsedPage = self.getParsedHttpPage(page);

            var normalItemPageLinks = self.getItemLinks(parsedPage,configFile)

            self.processItems(normalItemPageLinks,configFile,function(err){
                cb(err);    
            });
        } else cb(null);
        
    });
    
}

exports.processItems = function(linksArray,configFile,cb){    

    var self = this;

    async.eachSeries(linksArray, function(link, callback) {

        console.log (link);
        self.getPageContent(link, function(err, page) {
            if (!err){
                var parsedPage = self.getParsedHttpPage(page);            
                var itemObject = new ItemHandler(configFile['item_fields'], parsedPage);

                itemObject.getItemAttributes();
                itemObject.processPossibleValues(function() {

                 var currentItem = new Items({
                    link: link,
                    attributes: itemObject.returnItemAttributes()
                });

                 currentItem.save(function(err) {
                    callback(err);
                });
             });
            } else callback (null);

        });

    }, function(err){
        cb(err);
    });    
}

exports.processEachItemLinks = function(itemsArray,cb){
    var self = this;
    /*get link*/
    /*get page**/
    /*parse page*/
    /*save item**/

    async.each(itemsArray, function(item, itemProcessCb) {

        var itemConfigFile = new ItemConfig(item['config_file']);
        itemConfigFile.getConfigFile(function(err, configFile) {    
            //Getting config file once for Item
            //Should Parallel Items for One Link ?
            async.each(item.link, function(itemLink, linkProcessCb) {

                self.processLink(itemLink,configFile,function(err){
                    linkProcessCb(err);           
                });

            }, function(err){        
                itemProcessCb(err);
            });     
        });       

    }, function(err){
        cb(err);
    });    

}

exports.getPageContent = function (itemLink, cb) {
    var page = new Http(itemLink);
    page.getPageContent(function (err, html) {
       cb(err, html);
   });
}

exports.getParsedHttpPage = function (page) {
    var $ = cheerio.load(page, {
        normalizeWhitespace: true
    });
    $('script').remove();
    $('style').remove();
    $('meta').remove();

    return $;
}

exports.getActiveItems = function(cb){
    //get items from db to parse. with links and config files
    ItemsList.getActiveItemsList(function(err,list){
        cb(err,list);
    });
}