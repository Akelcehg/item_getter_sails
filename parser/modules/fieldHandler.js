var cheerio = require('cheerio');

function FieldHandler(node, nodeAttribute, page, bind_node, bind_node_attribute, expected_value) {
    async(function*() {

        this.node = node;
        this.nodeAttribute = nodeAttribute;
        this.page = page;

        this.bind_node = bind_node;
        this.bind_node_attribute = bind_node_attribute;
        this.expected_value = expected_value;
    })();
}

FieldHandler.prototype.getFieldValue = function() {
    //вернуть все значения поля. ?массив
    return getNodesData();
}

function getNodesData() {

    var self = this;
    var $ = cheerio.load(this.page, {
        normalizeWhitespace: true
    });

    var nodeData = [];
    var nodesArray = this.node.split(' ');

    var parentNode = nodesArray[0];

    nodesArray.shift();
    var childrenNodes = nodesArray;

    $(parentNode).each(function(i, elem) {

        var parent = $(this);

        /*if (self.bind_node) {
            var bindNodesArray = this.bind_node.split(' ');
            bindNodesArray.shift();
            var bindNodeParent = $(this);
            bindNodesArray.forEach(function(bindItem, i, arr) {
                bindNodeParent = bindNodeParent.children(bindItem);
            });
        }*/

        childrenNodes.forEach(function(item, i, arr) {
            parent = parent.children(item)
        });

        if (self.bind_node) {
            if (compareBindValue($(this))) {
                var data = getValueByAttributeType(self.nodeAttribute, parent);
                if (data) data = data.trim();
                nodeData.push(data);
            }
            //console.log(getValueByAttributeType(self.bind_node_attribute,bindNodeParent));
            /*var bindNodesArray = self.bind_node.split(' ');
            bindNodesArray.shift();
            var bindNodeParent = $(this);
            bindNodesArray.forEach(function(bindItem, i, arr) {
                bindNodeParent = bindNodeParent.children(bindItem);
            });

            var returnedBindNodeValue = getValueByAttributeType(self.bind_node_attribute, bindNodeParent);

            if (returnedBindNodeValue === self.expected_value) {
                nodeData.push(getValueByAttributeType(self.nodeAttribute, parent));
            }*/
        } else {
            var data = getValueByAttributeType(self.nodeAttribute, parent);
            if (data) data = data.trim();
            nodeData.push(data);
        }

    });
    return nodeData;
}

function getValueByAttributeType(attribute, parent) {
    if (attribute.indexOf('()') >= 0) {
        return parent[attribute.replace('()', '')]();
    } else {
        return parent.attr(attribute);
    }
}

function compareBindValue(valueNodeParent) {
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

module.exports = FieldHandler;
