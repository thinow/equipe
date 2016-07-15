var take = require('../lib/assertions').take();
var xlsxReader = require('xlsx');
var browse = require('../lib/browser').browse();
var dates = require('../lib/dates');

module.exports = {
    parse: function (data, args) {
        var data = take(data).ifTypeIs('object');
        var anchor = take(args.anchor).ifTypeIs('object');

        var self = this;
        var parsed = {dates: []};

        var xlsx = this.readAsXlsx(data);

        xlsx.SheetNames.forEach(function (sheetName) {
            parsed.weeks = self.fetchWeeks({
                xlsx: xlsx,
                sheet: sheetName,
                references: self.findAnchors({xlsx: xlsx, sheet: sheetName, regexp: anchor})
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

    fetchWeeks: function (args) {
        var self = this;

        var weeks = {};
        self.fetchDays(args).forEach(function (day) {
            var weekIndex = 'w' + dates.findWeek(day.date);
            weeks[weekIndex] = weeks[weekIndex] || {days: {}};
            weeks[weekIndex].days[day.reference] = day;
        });

        Object.keys(weeks).forEach(function (weekIndex) {
            var week = weeks[weekIndex];

            week.number = weekIndex;

            week.firstDay = Object.keys(week.days).reduce(function (left, right) {
                var day = week.days[left];
                var anotherDay = week.days[right];
                return day.date <= anotherDay.date ? left : right;
            });

            week.reference = browse({from: week.firstDay, to: ['left', 'up']});

            week.label = self.cell(Object.assign({type: 'text', ref: week.reference}, args));
        });

        return weeks;
    },

    fetchDays: function (args) {
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

        var value = xlsx.Sheets[sheet][ref].v;

        switch (type) {
            case 'date':
                return new Date((value - (25567 + 2)) * 86400 * 1000);

            default:
                return value;
        }
    }
}