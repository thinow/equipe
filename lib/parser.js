var take = require('../lib/assertions').take();
var xlsxReader = require('xlsx');
var browse = require('../lib/browser').browse();

module.exports = {
    parse: function (data, arguments) {
        var data = take(data).ifTypeIs('object');
        var anchor = take(arguments.anchor).ifTypeIs('object');

        var self = this;
        var parsed = {dates: []};

        var xlsx = this.readAsXlsx(data);

        xlsx.SheetNames.forEach(function (sheetName) {
            var anchorsRefs = self.findAnchors({xlsx: xlsx, sheet: sheetName, regexp: anchor});
            anchorsRefs.forEach(function (anchorRef) {
                var ref = browse({from: anchorRef, to: ['left']});
                var date = xlsx.Sheets[sheetName][ref].v;
                parsed.dates.push(new Date(date));
            });
        });

        return parsed;
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
    },

    findCell: function (anchorRef) {

    }
}