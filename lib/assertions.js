var assert = require('assert');
var util = require('util');

exports.take = function () {
    return function (value) {
        assert.notStrictEqual(value, undefined, 'Value must not be undefined');

        return {
            ifTypeIs: function (expectedType) {
                var message = util.format("Wrong type. expected:%s, actual:%s, value=%s", expectedType, typeof value, value);
                assert.equal(typeof value, expectedType, message);

                return value;
            }
        }
    }
};