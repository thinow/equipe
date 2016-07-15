var take = require('../lib/assertions').take();

const FORMAT = /([A-Z]+)([0-9]+)/;

const FIRST_ROW = 1;
const FIRST_COLUMN = 'A'.charCodeAt(0);

exports.browse = function () {

    return function (args) {
        var origin = take(args.from).ifMatches(FORMAT);
        var directions = take(args.to).ifIncludesOnly(['left', 'up', 'down']);

        return createDestination(origin)
            .apply(directions)
            .validate()
            .toString();
    };

    function createDestination(origin) {
        var match = FORMAT.exec(origin);
        var destination = {
            column: transform(match[1]).toCharCode(),
            row: transform(match[2]).toNumber()
        };

        destination.apply = function (directions) {
            directions.forEach(this.applyOne);
            return this;
        };

        destination.applyOne = function (direction) {
            switch (direction) {
                case 'left':
                    destination.column -= 1;
                    break;

                case 'up':
                    destination.row -= 1;
                    break;

                case 'down':
                    destination.row += 1;
                    break;
            }
        };

        destination.validate = function () {
            if (this.row < FIRST_ROW || this.column < FIRST_COLUMN) {
                throw new Error("Result reference is not usable : " + this.toString());
            }

            return this;
        };

        destination.toString = function () {
            return stringify(this.column).toLetter()
                + stringify(this.row).toNumber();
        };

        return destination;
    };

    function transform(value) {
        return {
            toCharCode: function () {
                var index = 0; // handle only the first char of the string for the moment
                return value.charCodeAt(index);
            },

            toNumber: function () {
                return new Number(value);
            }
        };
    };

    function stringify(number) {
        return {
            toLetter: function () {
                return String.fromCharCode(number);
            },

            toNumber: function () {
                return new String(number);
            }
        };
    };
}