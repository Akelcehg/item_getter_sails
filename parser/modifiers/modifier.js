module.exports = {
    digits: function (nodeData) {
        return nodeData.replace(/\D/g, '');
    },
    replaceString: function (nodeData, modifierData) {
        return nodeData.replace(modifierData[0], modifierData[1]);
    },
    getValueNextTo: function (nodeData, modifierData) {
        var nodeDataArray = nodeData.split(' ');
        var modifiedNodeData = null;
        for (var i in modifierData) {
            var modifiedNodeData = nodeDataArray[nodeDataArray.indexOf(modifierData[i]) - 1];
            if (modifiedNodeData) return modifiedNodeData;
        }
    },
    getRightValueNextTo: function (nodeData, modifierData) {
        var nodeDataArray = nodeData.split(' ');
        var modifiedNodeData = null;
        for (var i in modifierData) {
            var modifiedNodeData = nodeDataArray[nodeDataArray.indexOf(modifierData[i]) + 1];
            if (modifiedNodeData) return modifiedNodeData;
        }
    }
};
