var FieldHandler = require('./fieldHandler.js');
var AttributesGroups = require('../models/attributesGroups').schema;
var cheerio = require('cheerio');
var async = require('async');

function ItemHandler(item_fields, item_page) {
    this.item_page = item_page;
    this.item_fields_config = item_fields;
    this.item_fields = [];
}

ItemHandler.prototype.getItemAttributes = function () {
    var self = this;

    self.item_fields_config.forEach(function (field_config, i, arr) {

        var fieldHandler = new FieldHandler(
            field_config['field_node'],
            field_config['field_attribute'],
            self.item_page,
            field_config['bind_node'],
            field_config['bind_node_attribute'],
            field_config['expected_value']
        );
        var itemFieldObject = {
            'name': field_config['name'],
            'value': fieldHandler.getFieldValue()
        };
        var fieldName = field_config['field_name'];
        var fieldObj = {};
        fieldObj[fieldName] = itemFieldObject;
        //self.item_fields[fieldName] = itemFieldObject;
        //self.item_fields.push(fieldObj);
        self.item_fields.push(fieldObj);
        //https://habrahabr.ru/post/177761/
    });
};

ItemHandler.prototype.processPossibleValues = function (cb) {

    var self = this;

    AttributesGroups.getPossible(function (err, groups) {
        async.each(groups, function (group, callback) {

            if (self.item_fields[group['group_en_name']]) {
                var possibleObjectField = self.item_fields[group['group_en_name']];
                console.log(possibleObjectField);

                for (var i in group['attributes']) {
                    console.log(group['attributes'][i]);
                    if (possibleObjectField['value'][0].indexOf(group['attributes'][i]) > -1) {
                        //console.log('содержит ' + group['attributes'][i]);
                        possibleObjectField['value'] = [group['attributes'][i]];
                        //possibleObjectField['display_value'] = [i];
                    }
                }
            }
            callback();
        }, function (err) {
            cb(err, null);
        });

    });
};

ItemHandler.prototype.returnItemAttributes = function () {
    return this.item_fields;
};

module.exports = ItemHandler;
