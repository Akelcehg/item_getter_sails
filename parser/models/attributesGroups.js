var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AttributesGroupsSchema = new Schema({
    group_name: String,
    group_en_name: String,
    is_possible: Boolean,
    attributes: {type: Array, index: true}

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
        console.log(attributes);
        if (err) {
            console.log(err);
            cb(err, []);
        } else cb(null, attributes);
    }).select('attributes');
};

AttributesGroupsSchema.statics.getPossible = function (cb) {
    this.model('attributes_groups').find({'is_possible': true}, function (err, attributesGroups) {
        if (err) {
            console.log(err);
            cb(err, []);
        } else cb(null, attributesGroups);
    })
};

AttributesGroupsSchema.statics.saveAttributeToGroup = function (groupId, attributeObj, cb) {
    console.log(attributeObj);
    this.model('attributes_groups').findByIdAndUpdate(groupId, {$push: {"attributes": attributeObj}}, {
            safe: true,
            upsert: true
        },
        function (err, model) {
            if (err) console.log(err);
            cb(err);
        }
    );
};

exports.schema = mongoose.model('attributes_groups', AttributesGroupsSchema);