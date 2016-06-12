var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var itemsListSchema = new Schema({
    link: Array,
    name: String,    
    active: { type: Boolean, default: true },
    config_file: String

});
itemsListSchema.set('collection', 'items_list');

itemsListSchema.methods.getAllItems = function (cb) {
    this.model('items_list').find(function (err, items) {
        if (err) {
            console.log(err);
            cb(err, []);
        } else cb(null, items);
    });
};

itemsListSchema.statics.getActiveItemsList = function (cb) {
    this.model('items_list').find({
        'active' : true
    },function (err, items) {        
        cb(err, items);
    });
};

exports.schema = mongoose.model('items_list', itemsListSchema);
exports.name = 'items_list';
