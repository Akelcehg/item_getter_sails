/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  hi: function (req, res) {
    var q = Items.find();
    q.limit(2);
    q.exec(function cb(err,data) {
      console.log ("Searching");
      console.log (err);
      console.log (data);
    });
    return res.send("Hi there!");
  }

};

