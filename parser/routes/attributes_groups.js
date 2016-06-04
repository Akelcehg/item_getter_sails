var express = require('express'),
    router = express.Router(),
    AttributesGroups = require('../models/attributesGroups').schema;

router.get('/', function (req, res, next) {

    AttributesGroups.getAll('group_name _id', function (err, groups) {
        res.render('attributes_groups', {AttributesGroups: groups});
    });
});

module.exports = router;
