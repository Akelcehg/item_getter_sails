var File = require('./file.js');
var basePath = __dirname + '/../';

function ItemConfig(itemName) {
    //async(function*() {
        this.itemName = itemName;
    //})();
}

ItemConfig.prototype.getConfigFile = function(cb) {
    var file = new File();
    file.getFile(basePath + 'items_config/' + this.itemName + '.json', function(err, content) {
        cb(err, JSON.parse(content));
    });
}

module.exports = ItemConfig;