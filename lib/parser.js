var take = require('../lib/assertions').take();
var xlsxReader = require('xlsx');
var browse = require('../lib/browser').browse();

module.exports = {
    parse: function (data, args) {
        var data = take(data).ifTypeIs('object');
        var anchor = take(args.anchor).ifTypeIs('object');

        var self = this;
        var parsed = {dates: []};

        var xlsx = this.readAsXlsx(data);

        xlsx.SheetNames.forEach(function (sheetName) {
            var anchorsRefs = self.findAnchors({xlsx: xlsx, sheet: sheetName, regexp: anchor});
            anchorsRefs.forEach(function (anchorRef) {
                var ref = browse({from: anchorRef, to: ['left', 'down']});
                var date = self.cell({xlsx: xlsx, sheet: sheetName, type: 'date', ref: ref});
                parsed.dates.push(date);
            });
        });

        return parsed;
    },

    readAsXlsx: function (data) {
        return xlsxReader.read(data);
    },

    findAnchors: function (args) {
        var xlsx = take(args.xlsx).ifTypeIs('object');
        var sheet = take(args.sheet).ifTypeIs('string');
        var regexp = take(args.regexp).ifTypeIs('object');

        var cells = xlsx.Sheets[sheet];
        return Object.keys(cells).filter(function (reference) {
            var cell = cells[reference];
            return regexp.test(cell.w)
        });
    },

    fetchDates: function (args) {
        var self = this;

        return args.references.map(function (reference) {
            var referenceOfDate = browse({from: reference, to: ['left', 'down']});
            return {
                reference: reference,
                date: self.cell(Object.assign({type: 'date', ref: referenceOfDate}, args))
            };
        });
    },

    cell: function (args) {
        var xlsx = take(args.xlsx).ifTypeIs('object');
        var sheet = take(args.sheet).ifTypeIs('string');
        var ref = take(args.ref).ifTypeIs('string');
        var type = take(args.type).ifTypeIs('string');

        var days = xlsx.Sheets[sheet][ref].v;
        return new Date((days - (25567 + 2)) * 86400 * 1000);
    }
}