var express = require('express'),
    router = express.Router();

router.get('/', function (req, res, next) {
    
    res.render('controls/index');
});

module.exports = router;
