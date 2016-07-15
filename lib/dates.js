var take = require('../lib/assertions').take();
var currentWeekNumber = require('current-week-number');

exports.fromExcelValue = function (value) {
    take(value).ifTypeIs('number');

    return new Date((value - (25567 + 2)) * 86400 * 1000)
};

exports.findWeek = function (date) {
    return currentWeekNumber(date)
};