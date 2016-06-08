var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var ItemSchema = new Schema({
    link: String,
    name: String,
    itemId: Number,
    createdAt: {type: Date, default: Date.now},
    attributes: Object
    //attributes: Object
});

//ItemSchema.index({"attributes.price": 1});
//ItemSchema.index({ "itemId": 1, "number": 1 }, { unique: true });

/*PersonSchema
 .virtual('name.full')
 .get(function () {
 return this.name.first + ' ' + this.name.last;
 });*/

ItemSchema.set('collection', 'items');
ItemSchema.plugin(autoIncrement.plugin, {model: 'item', field: 'itemId', startAt: 1});

ItemSchema.methods.saveItem = function (attrbutesObject, cb) {
    cb();
};

exports.schema = mongoose.model('items', ItemSchema);
exports.name = 'item';
