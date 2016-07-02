var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Parser = require(__dirname + '/../modules/parser'),
    _is_parsing = false;
AttributesGroups = require('../models/attributesGroups').schema;


router.get('/', function (req, res, next) {
    res.render('controls/index');
});

router.post('/start_parse', function (req, res, next) {

    console.log("Starting parsing");
    console.log(_is_parsing);
    if (_is_parsing === false) {
        _is_parsing = true;
        async.waterfall([
            function (callback) {
                console.log("a");
                //getting all active items with links from database
                Parser.getActiveItems(function (err, activeItemsList) {
                    callback(err, activeItemsList)
                });
            },
            function (activeItemsList, callback) {
                Parser.processEachItemLinks(activeItemsList, function (err, itemPageContent) {
                    callback(err, itemPageContent);
                });
            }
        ], function (err, result) {
            if (err) console.log(err);
            else console.log('Done');
            _is_parsing = false;
            res.json({
                'status': 'ok'
            });
        });

    }
});

router.post('/convert_json', function (req, res, next) {

    var request = require('request');
    var translit = require('translitit-cyrillic-russian-to-latin');
    request('https://auto.ria.com/api/states?langId=2', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parsed = JSON.parse(body);

            var fs = require('fs');
            fs.readFile('test.json', function (err, data) {
                var x = JSON.parse(data);
                if (err) return console.log(err);
                console.log('File = ' + x.length);
            });

            //https://auto.ria.com/api/categories/1/marks/98/models?langId=2

            var obj = {
                "group_name": "Области",
                "group_en_name": "states",
                "is_possible": true,
                "attributes": [],
            };
            var arr = [];


            console.log('Http = ' + parsed.length);
            for (var i in parsed) {
                //var s = translit(parsed[i].name.replace(' ','_').toLowerCase());
                //console.log (s);

                //obj.attributes.push({name : parsed[i].name,en_name:translit(s)});

                /*(function (ii) {
                 var s = translit(parsed[ii].name.replace(' ','_').toLowerCase());
                 //console.log (s);
                 var index = 1;
                 var count = parsed.length;
                 var obj = {};
                 obj = {
                 "group_name" : parsed[ii].name,
                 "group_en_name" : translit(s),
                 "is_possible" : true,
                 "attributes" : [
                 ],
                 };
                 //request('https://auto.ria.com/api/categories/1/marks/'+parsed[ii].value+'/models?langId=2', function (error, response, bodyGroups) {
                 request('https://auto.ria.com/api/states/'+parsed[ii].value+'/cities?langId=2', function (error, response, bodyGroups) {
                 if (!error && response.statusCode == 200) {

                 var parsed2 = JSON.parse(bodyGroups);

                 for (var j in parsed2) {

                 var s2 = translit(parsed2[j].name.replace(' ','_').toLowerCase());
                 obj.attributes.push({name : parsed2[j].name,en_name:translit(s2)});
                 //arr.push(obj);

                 }

                 //console.log (count);
                 //console.log (index);

                 fs = require('fs');
                 fs.appendFile('test.json', JSON.stringify(obj), function (err) {
                 if (err) return console.log(err);
                 console.log('Hello World > helloworld.txt ' + s);
                 });
                 }
                 });
                 }(i));*/


            }

            //			console.log (obj);

            /*fs = require('fs');
             fs.writeFile('test.json', JSON.stringify(obj), function (err) {
             if (err) return console.log(err);
             console.log('Hello World > helloworld.txt');
             });*/

            /*			var newGroup = new AttributesGroups(obj);
             newGroup.save(function (err) {
             if (err) {
             console.log(err);
             }else console.log ("saved");

             });*/
            res.json({
                'status': 'ok'
            });
        }
    })


});


router.post('/load_groups', function (req, res, next) {
    var fs = require('fs');
    fs.readFile('collections_data/attributes_groups.json', function (err, data) {
        var x = JSON.parse(data);
        if (err) return console.log(err);
        
        async.eachSeries(x, function (group, callback) {
            var newGroup = new AttributesGroups(group);

            newGroup.save(function (err) {
                if (err) {
                    console.log(err);
                }
                callback();
            });
        }, function (err) {

            if (err) {
                console.log('Error saving Group');
                res.json({
                    'status': 'fail'
                });
            } else {
                console.log('All groups saved');
                res.json({
                    'status': 'ok'
                });
            }
        });

    });

});

module.exports = router;
