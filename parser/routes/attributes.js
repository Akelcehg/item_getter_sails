var express = require('express'),
    router = express.Router(),
    AttributesGroups = require('../models/attributesGroups').schema;

/*router.get('/', function (req, res, next) {
 AttributesGroups.getAll('group_name _id', function (err, groups) {
 res.render('attributes/attributes_groups', {AttributesGroups: groups});
 });
 });*/

router.get('/new_attribute/:id', function (req, res, next) {
    //adding attribute page
    res.render('attributes_groups/attributes/new_attribute');
});

router.post('/new_attribute/:id', function (req, res, next) {
    //adding attribute
    var attributeObject = {
        'name': req.body['attribute_name'],
        'en_name': req.body['attribute_en_name'],
        'count': 0
    };
    AttributesGroups.saveAttributeToGroup(req.params.id, attributeObject, function (err) {
        res.render('attributes_groups/attributes/new_attribute');
    })
});

module.exports = router;
