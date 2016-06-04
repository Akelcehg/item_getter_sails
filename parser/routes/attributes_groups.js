var express = require('express'),
    router = express.Router(),
    AttributesGroups = require('../models/attributesGroups').schema;

router.get('/', function (req, res, next) {
    AttributesGroups.getAll('group_name _id', function (err, groups) {
        res.render('attributes_groups/attributes_groups', {AttributesGroups: groups});
    });
});

router.get('/new', function (req, res, next) {
    res.render('attributes_groups/new_group');
});

router.get('/:id', function (req, res, next) {

    var groupAttributes = new AttributesGroups({
        _id: req.params.id
    });

    groupAttributes.getAttributes(function (err, attributes) {
        res.render('attributes_groups/attributes', {Attributes: attributes});
    });
});

module.exports = router;
