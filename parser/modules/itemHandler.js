var FieldHandler = require('./fieldHandler.js');
var AttributesGroups = require('../models/attributesGroups').schema;
var cheerio = require('cheerio');
var async = require('async');

function ItemHandler(item_fields, item_page) {
    this.item_page = item_page;
    this.item_fields_config = item_fields;
    //this.item_fields = [];
    this.item_fields = {};
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
            field_config['expected_value'],
            field_config['modifiers'],
            field_config['modifiers_values']
        );

        var itemFieldObject = {
            'value': fieldHandler.getFieldValue(),
            'search_value': ''
        };
        /*        var itemFieldObject = {
         //'name': field_config['name'],
         'value': fieldHandler.getFieldValue()
         };*/
        /*        var fieldName = field_config['field_name'];
         var fieldObj = {};
         fieldObj[fieldName] = itemFieldObject;
         self.item_fields[fieldName] = itemFieldObject;
         var itemFieldObject = {};*/
        var fieldName = field_config['field_name'];

        //self.item_fields[fieldName] = fieldHandler.getFieldValue();
        self.item_fields[fieldName] = itemFieldObject;

        //self.item_fields.push(itemFieldObject);

        //https://habrahabr.ru/post/177761/
    });
};

ItemHandler.prototype.processPossibleValues = function (cb) {

    var self = this;
    var possibleValuesArray = [];

    self.item_fields_config.forEach(function (configField, i, arr) {

        if (configField.is_possible) {

            possibleValuesArray.push(
                {
                    "attributes.name": self.item_fields[configField['field_name']]['value'][0]
                }
            )
        }
    });

    AttributesGroups.getPossible(possibleValuesArray, function (err, groupsIndexes) {

        for (var i in self.item_fields) {

            if (self.item_fields[i].value[0]) {
                groupsIndexes.forEach(function (group) {

                    if (self.item_fields[i].value[0] == group.value) {
                        self.item_fields[i].search_value = [group.attribute_id];
                    }
                });
            }
            if (!self.item_fields[i].search_value) self.item_fields[i].search_value = self.item_fields[i].value;
        }


        groupsIndexes.forEach(function (group, i, arr) {
            if (self.item_fields[group['group_name']]) {
                self.item_fields[group['group_name']]['search_value'] = group['attribute_id'];
            }
        });

        cb(null, null);
    });
};

ItemHandler.prototype.returnItemAttributes = function () {
    return this.item_fields;
};

module.exports = ItemHandler;
