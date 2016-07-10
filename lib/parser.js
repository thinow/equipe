var take = require('../lib/assertions').take();
var xlsxReader = require('xlsx');

module.exports = {
    parse: function (data) {
        var data = take(data).ifTypeIs('object');

        //var xlsx = this.readAsXlsx(data);

        return {'dates': ['to-be-defined']};
    },

    readAsXlsx: function (data) {
        return xlsxReader.read(data);
    },

    findAnchors: function (arguments) {
        var xlsx = take(arguments.xlsx).ifTypeIs('object');
        var sheet = take(arguments.sheet).ifTypeIs('string');
        var regexp = take(arguments.regexp).ifTypeIs('object');

        var anchors = [];
        var cells = xlsx.Sheets[sheet];
        Object.keys(cells).forEach(function (ref) {
            var cell = cells[ref];
            if (regexp.test(cell.w)) {
                anchors.push(ref)
            }
        });

        return anchors;
    }
}