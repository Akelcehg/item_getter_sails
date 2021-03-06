var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var AttributesGroupsSchema = new Schema({
    group_name: String,
    group_en_name: String,
    is_possible: Boolean,
    group_id: Number,
    createdAt: {type: Date, default: Date.now},
    //attributes: Array
    attributes: [{
        attributeId: {type: Number, default: '1'},
        name: String,
        en_name: {type: String, default: ""},
        count: {type: Number, default: 0},
        createdAt: {type: Date, default: Date.now}
    }]
});

//AttributesGroupsSchema.index({ "_userId": 1, "number": 1 }, { unique: true });
AttributesGroupsSchema.set('collection', 'attributes_groups');
AttributesGroupsSchema.plugin(autoIncrement.plugin, {model: 'attributes_groups', field: 'group_id', startAt: 1});


var CounterSchema = Schema({
    name: {type: String, required: true},
    seq: {type: Number, default: 1}
});

CounterSchema.set('collection', 'counter');

var counter = mongoose.model('counter', CounterSchema);

AttributesGroupsSchema.pre('save', function (next) {

    var doc = this;
    counter.find({'name': "group_counter"}, function (err, counterObj) {
        if (counterObj.length == 0) {
            var c = new counter();
            c.name = "group_counter";
            c.seq = 1;
            c.save(function (err) {
                for (var i = 0; i < doc.attributes.length; i++) {
                    doc.attributes[i]['attributeId'] = i + 1;
                }
                next(err);
            });
        } else {
            var newSeq = counterObj[0].seq + doc.attributes.length;
            for (var i = 0; i < doc.attributes.length; i++) {
                doc.attributes[i]['attributeId'] = i + 1 + counterObj[0].seq;
            }
            counter.findOneAndUpdate({'name': "group_counter"}, {
                "seq": newSeq
            }, {upsert: true}, function (err, doc) {
                next(err);
            });
        }
    });
});

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

AttributesGroupsSchema.statics.getPossible = function (conditionArray, cb) {

    var filterArray = [];

    for (var i = 0; i < conditionArray.length; i++) {
        filterArray.push(
            {$eq: ['$$attribute.name', conditionArray[i]['attributes.name']]}
        )
    }

    this.model('attributes_groups').aggregate([

        {$match: {$or: conditionArray}},
        {
            $project: {
                'group_en_name': 1,

                attributes: {

                    $filter: {
                        input: '$attributes',
                        as: 'attribute',
                        //cond: {$eq: ['$$attribute.name', 'E-Class']},
                        //cond: {$eq: ['$$attribute.name', 'E-Class']},
                        cond: {
                            $or: filterArray
                        }
                    }
                }
            }
        }
    ]).exec(function (err, attributesGroups) {

        var indexArray = [];

        attributesGroups.forEach(function (attribute, i, arr) {
            indexArray.push(
                {
                    "group_name": attribute['group_en_name'],
                    "value": attribute.attributes[0].name,
                    "attribute_id": attribute.attributes[0].attributeId
                }
            );
        });

        if (err) {
            console.log(err);
            cb(err, []);
        } else cb(null, indexArray);
    });

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