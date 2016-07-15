var take = require('../lib/assertions').take();

exports.fromExcelValue = function (value) {
    take(value).ifTypeIs('number');

    return new Date((value - (25567 + 2)) * 86400 * 1000)
};

exports.findWeek = function (date) {
    // todo
    return date < new Date('2016-06-18') ? 25 : 26;
};