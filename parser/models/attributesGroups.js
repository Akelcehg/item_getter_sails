var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AttributesGroups = new Schema({
    group_name: String,
    is_possible: Boolean,
    attributes: Array

});

AttributesGroups.set('collection', 'attributes_groups');

AttributesGroups.methods.saveItem = function () {

};

exports.schema = mongoose.model('items', AttributesGroups);