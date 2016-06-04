var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AttributesGroupsSchema = new Schema({
    group_name: String,
    is_possible: Boolean,
    attributes: Array

});

AttributesGroupsSchema.set('collection', 'attributes_groups');

AttributesGroupsSchema.statics.getAll = function (attrs, cb) {

    var query = this.model('attributes_groups').find();

    if (attrs) query.select(attrs);

    query.exec(function (err, items) {
        if (err) {
            console.log(err);
            cb(err, []);
        } else cb(null, items);
    });


};

AttributesGroupsSchema.methods.getAttributes = function (cb) {
    this.model('attributes_groups').findById(this._id, function (err, attributes) {
        if (err) {
            console.log(err);
            cb(err, []);
        } else cb(null, attributes);
    })
};

exports.schema = mongoose.model('attributes_groups', AttributesGroupsSchema);