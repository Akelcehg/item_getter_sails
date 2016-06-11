/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {
    Items.getLatestItems({itemsLimit: 1}, function (err, item) {
      return res.view("description", {item: item[0]});
    });
  }

};

