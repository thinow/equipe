var xlsxReader = require('xlsx');

module.exports = {
    parse: function (data) {
        if (data == undefined) {
            throw new ReferenceError();
        }

        //var xlsx = this.readAsXlsx(data);

        return {'dates': ['to-be-defined']};
    },

    readAsXlsx: function (data) {
        return xlsxReader.read(data);
    },

    findAnchors: function (arguments) {
        var xlsx = arguments.xlsx;
        var sheet = arguments.sheet;
        var anchor = arguments.anchor;

        var anchors = [];
        var cells = xlsx.Sheets[sheet];
        Object.keys(cells).forEach(function (ref) {
            var cell = cells[ref];
            if (cell.w == anchor) {
                anchors.push(ref)
            }
        });

        return anchors;
    }
}