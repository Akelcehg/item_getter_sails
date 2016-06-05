var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Item = new Schema({
    link: String,
    name: String,
    //attributes: {type: Array, index: true}
    attributes:  Array
    //attributes: Object

});

Item.set('collection', 'items');

Item.methods.saveItem = function (attrbutesObject, cb) {
    cb();
};

exports.schema = mongoose.model('items', Item);
exports.name = 'item';
