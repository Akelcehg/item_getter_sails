/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {
    Items.getLatestItems({
      itemsLimit: 6
    }, function (err, items) {      
      if (err) {
        return res.notFound("Couldn't find latest Items");
      } else return res.view("homepage", {items: items});
    });
  }

};

