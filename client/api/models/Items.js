/**
 * Items.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    link: 'string',
    name: 'string',
    itemId: 'integer',
    createdAt: {type: 'date'},
    attributes: 'json'
  },

  getLatestItems: function (opts, cb) {

    var defaultItemsLimit = 6,
      itemsLimit = opts.itemsLimit || defaultItemsLimit;

    var query = Items.find();
    query.limit(itemsLimit);
    query.sort('createdAt DESC');
    query.exec(function (err, data) {
      cb(err, data);
    });

  }

};

