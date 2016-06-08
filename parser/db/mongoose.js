var mongoose = require('mongoose'),
 	autoIncrement = require('mongoose-auto-increment');
mongoose.connect('mongodb://localhost:27017/item_manager', { config: { autoIndex: false }});
var db = mongoose.connection;
autoIncrement.initialize(db);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    //console.log("Connected to mongoDb");
});