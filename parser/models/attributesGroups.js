var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var AttributesGroupsSchema = new Schema({
    group_name: String,
    group_en_name: String,
    is_possible: Boolean,
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

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 1}
});
CounterSchema.set('collection', 'counter');

var counter = mongoose.model('counter', CounterSchema);

AttributesGroupsSchema.pre('save', function (next) {
    var doc = this;

    for (var i = 0; i < this.attributes.length; i++) {
        this.attributes[i]['attributeId'] = i + 1;
    }

    var c = new counter();
    c._id = doc.group_en_name;
    c.seq = doc['attributes.attributeId'] = doc.attributes.length;
    c.save(function (err) {
        if (err) next(err);
        else next();
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

    /*    this.model('attributes_groups').find({
     $or: conditionArray
     }, function (err, attributesGroups) {
     if (err) {
     console.log(err);
     cb(err, []);
     } else cb(null, attributesGroups);
     }).select('group_en_name');*/

  //  console.log(conditionArray);
    var filterArray = [];

    for (var i = 0; i < conditionArray.length; i++) {
        filterArray.push(
            {$eq : ['$$attribute.name',conditionArray[i]['attributes.name']]}
        )
    }
//console.log (filterArray);
    this.model('attributes_groups').aggregate([
        // Get just the docs that contain a shapes element where color is 'red'
        //{$match: {'attributes.name': 'E-Class'}},
        //{$match: {'attributes.name': 'Луцк'}},
        {$match: {$or: conditionArray}},
        {
            $project: {
                'group_en_name' : 1,
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
        //console.log (attributesGroups[0].attributes[0].attributeId);
        //console.log (attributesGroups[1].attributes[0].attributeId);
        console.log(attributesGroups);
        if (err) {
            console.log(err);
            cb(err, []);
        } else cb(null, attributesGroups);
    });

    /*    this.model('attributes_groups').find()
     .where('attributes', {$elemMatch: {"name": "E-Class"}})
     .exec(function (err, attributesGroups) {

     console.log(attributesGroups);

     if (err) {
     console.log(err);
     cb(err, []);
     } else cb(null, attributesGroups);
     })*/


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