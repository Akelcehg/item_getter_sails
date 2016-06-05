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

router.get('/edit/:id', function (req, res, next) {
    var updateId = req.params.id;
    AttributesGroups.findOne({_id: updateId}, function (err, group) {
        if (err) console.log (err);
        res.render('attributes_groups/update_group', {'group': group});
    });
});

router.get('/delete/:id', function (req, res, next) {
    var deleteId = req.params.id;
    console.log(deleteId);
    AttributesGroups.remove({_id: deleteId}, function (err) {
        if (err) return handleError(err);
        if (err) {
            console.log(err);
        } else res.redirect('/attributes_groups');
    });
});

router.post('/new', function (req, res, next) {
    //console.log (req.body['attributes'].split(','));
    var groupObject = {
        'group_name': req.body['group_name'],
        'group_en_name': req.body['group_en_name'],
        'is_possible': req.body['is_possible'] || false,
        'attributes': req.body['attributes'].split(',')
    };
    console.log(groupObject);
    var newGroup = new AttributesGroups(groupObject);
    newGroup.save(function (err) {
        if (err) {
            console.log(err);
            res.render('attributes_groups/new_group');
        }
        else res.redirect('/attributes_groups');
    });

});

module.exports = router;
