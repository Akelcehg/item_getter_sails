var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async'),
    autoIncrement = require('mongoose-auto-increment');

var ItemSchema = new Schema({
    link: String,
    name: String,
    itemId: {type: Number, index: true},
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

ItemSchema.statics.updateLinksOnSavedItems = function (links, cb) {
    this.model('items').find({
        'link': {"$in": links}
    }, function (err, itemsLinks) {

        for (var i in itemsLinks) {
            var index = links.indexOf(itemsLinks[i]['link']);
            if (index > -1) {
                links.splice(index, 1);
            }

        }
        
        cb(null, links);

    }).select('link -_id');
};

exports.schema = mongoose.model('items', ItemSchema);
exports.name = 'item';
