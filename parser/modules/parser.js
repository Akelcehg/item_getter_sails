//var Item = MODEL('item').schema;
var Http = require('./http.js');
var File = require('./file.js');
var ItemConfig = require('./itemConfig');
var FieldHandler = require('./fieldHandler');
var cheerio = require('cheerio');
var async = require('async');

var ItemsList = require('../models/itemsList').schema;    

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
        if(!link.indexOf(listObject['domain']) > -1) {
            return listObject['domain'] + link;
        } else return link;
    });

    //return fieldHandler.getFieldValue();
    return updatedLinks;
};

exports.processLink = function(link,configFile,cb){    
    var self = this;    
    //get link page content    
    self.getPageContent(link,function(err,page){
        var parsedPage = self.getParsedHttpPage(page);
        
        var normalItemPageLinks = self.getItemLinks(parsedPage,configFile)


        cb(err);
    });
    
}

exports.processItems = function(linksArray,cb){    
    cb();
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
            async.eachSeries(item.link, function(itemLink, linkProcessCb) {

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