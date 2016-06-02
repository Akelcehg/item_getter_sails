var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Item = new Schema({
    link: String,
    name: String,
    attributes: Array

});

Item.set('collection', 'items');

Item.methods.saveItem = function() {

};

exports.schema = mongoose.model('items', Item);
exports.name = 'item';
