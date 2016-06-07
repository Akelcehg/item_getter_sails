module.exports = {
    digits: function (nodeData) {
        return nodeData.replace(/\D/g, '');
    },
    replaceString: function (nodeData, modifierData) {
        console.log(modifierData);
        return nodeData.replace(modifierData[0], modifierData[1]);
    },
    getValueNextTo: function (nodeData, modifierData) {
        var nodeDataArray = nodeData.split(' ');
        return nodeDataArray[nodeDataArray.indexOf(modifierData[0]) - 1]
    }
};
