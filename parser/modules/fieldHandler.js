var cheerio = require('cheerio');

function FieldHandler(node, nodeAttribute, page, bind_node, bind_node_attribute, expected_value) {

    this.node = node;
    this.nodeAttribute = nodeAttribute;
    this.page = page;

    this.bind_node = bind_node;
    this.bind_node_attribute = bind_node_attribute;
    this.expected_value = expected_value;
}

FieldHandler.prototype.getFieldValue = function () {
    //вернуть все значения поля. ?массив
    return this.getNodesData(this);
};

FieldHandler.prototype.getNodesData = function () {
    var self = this;
    /*var $ = cheerio.load(this.page, {
        normalizeWhitespace: true
    });*/
    var $ = this.page;

    var nodeData = [];

    var nodesArray = this.node.split(' ');

    var parentNode = nodesArray[0];

    nodesArray.shift();
    var childrenNodes = nodesArray;

    $(parentNode).each(function (i, elem) {

        var parent = $(this);

        childrenNodes.forEach(function (item, i, arr) {
            parent = parent.children(item)
        });

        var data = null;
        if (self.bind_node) {
            if (self.compareBindValue($(this))) {
                data = getValueByAttributeType(self.nodeAttribute, parent);
                if (data) data = data.trim();
                nodeData.push(data);
            }
        } else {
            data = getValueByAttributeType(self.nodeAttribute, parent);
            if (data) data = data.trim();
            nodeData.push(data);
        }

    });
    return nodeData;
};

function getValueByAttributeType(attribute, parent) {
    if (attribute.indexOf('()') >= 0) {
        return parent[attribute.replace('()', '')]();
    } else {
        return parent.attr(attribute);
    }
}

//function compareBindValue(valueNodeParent) {
FieldHandler.prototype.compareBindValue = function (valueNodeParent) {
    var self = this;

    var bindNodesArray = self.bind_node.split(' ');

    var bindNodeParent = valueNodeParent;

    bindNodesArray.shift();

    bindNodesArray.forEach(function (bindItem, i, arr) {
        bindNodeParent = bindNodeParent.children(bindItem);
    });

    var returnedBindNodeValue = getValueByAttributeType(self.bind_node_attribute, bindNodeParent);

    if (returnedBindNodeValue) returnedBindNodeValue = returnedBindNodeValue.trim();

    if (returnedBindNodeValue === self.expected_value) {
        return true;
    }
}

module.exports = FieldHandler;
