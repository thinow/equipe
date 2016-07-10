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
            },

            ifMatches: function (regExp) {
                var message = util.format("Does not match the regular expression. pattern:%s, value=%s", regExp, value);
                assert.ok(regExp.test(value), message);

                return value;
            },

            ifIncludesOnly: function (expectedValues) {
                assert.ok(util.isArray(expectedValues), "Expected values should be an array. expectedValues=" + expectedValues);
                assert.ok(util.isArray(value), "Value should be an array. value=" + value);

                var message = util.format("Value should includes only expected values. value=%s, expected=%s", value, expectedValues);
                assert.ok(this.includesOnly(value, expectedValues), message);

                return value;
            },

            includesOnly: function (actual, expected) {
                var containsOnlyExpectedValues = true;
                actual.forEach(function (item) {
                    if (expected.indexOf(item) < 0) {
                        containsOnlyExpectedValues = false;
                    }
                });

                return containsOnlyExpectedValues;
            }
        }
    }
};