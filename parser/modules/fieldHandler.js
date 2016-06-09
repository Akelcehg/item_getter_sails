var cheerio = require('cheerio'),
    modifier = require(__dirname + '/../modifiers/modifier');

function FieldHandler(node, nodeAttribute, page, bind_node, bind_node_attribute, expected_value, modifiers, modifiers_values) {

    this.node = node;
    this.nodeAttribute = nodeAttribute;
    this.page = page;

    this.bind_node = bind_node;
    this.bind_node_attribute = bind_node_attribute;
    this.expected_value = expected_value;

    this.modifiers = modifiers;
    this.modifiers_values = modifiers_values;
}

FieldHandler.prototype.getFieldValue = function() {
    //вернуть все значения поля. ?массив
    return this.getNodesData(this);
};

FieldHandler.prototype.getNodesData = function() {
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

    $(parentNode).each(function(i, elem) {

        var parent = $(this);

        childrenNodes.forEach(function(item, i, arr) {
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

    if (self.modifiers && nodeData) {
        nodeData = self.executeModifiers(nodeData);
    }

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
FieldHandler.prototype.compareBindValue = function(valueNodeParent) {
    var self = this;

    var bindNodesArray = self.bind_node.split(' ');

    var bindNodeParent = valueNodeParent;

    bindNodesArray.shift();

    bindNodesArray.forEach(function(bindItem, i, arr) {
        bindNodeParent = bindNodeParent.children(bindItem);
    });

    var returnedBindNodeValue = getValueByAttributeType(self.bind_node_attribute, bindNodeParent);

    if (returnedBindNodeValue) returnedBindNodeValue = returnedBindNodeValue.trim();

    if (returnedBindNodeValue === self.expected_value) {
        return true;
    }
}

FieldHandler.prototype.executeModifiers = function(nodeData) {

    for (var i in this.modifiers) {
        for (var j in nodeData) {
            if (nodeData[j]) {
                if (this.modifiers_values) {
                    nodeData[j] = modifier[this.modifiers[i]](nodeData[j], this.modifiers_values[i]);
                } else nodeData[j] = modifier[this.modifiers[i]](nodeData[j]);
            }
        }

    }
    return nodeData;
};

module.exports = FieldHandler;
