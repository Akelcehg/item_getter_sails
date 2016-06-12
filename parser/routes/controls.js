var express = require('express'),
router = express.Router(),
async = require('async'),
Parser = require(__dirname + '/../modules/parser');

router.get('/', function (req, res, next) {
	res.render('controls/index');
});

router.post('/start_parse', function (req, res, next) {

	async.waterfall([
		function(callback) {
			//getting all active items with links from database
			Parser.getActiveItems(function(err,activeItemsList){
				callback(err,activeItemsList)
			});
		},
		function(activeItemsList, callback) {			
			Parser.processEachItemLinks(activeItemsList,function(err,itemPageContent){
				callback(err, itemPageContent);
			});			

		}
		], function (err, result) {			
			if (err) console.log (err);
			else console.log ('Done')
			res.json({'status' : 'ok'});
		});


});

module.exports = router;
