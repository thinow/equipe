var take = require('../lib/assertions').take();

const FORMAT = /([A-Z]+)([0-9]+)/;

exports.browse = function () {

    return function (arguments) {
        var origin = take(arguments.from).ifMatches(FORMAT);
        var directions = take(arguments.to).ifIncludesOnly(['left']);

        return createDestination(origin)
            .apply(directions)
            .toString();
    }

    function createDestination(origin) {
        var match = FORMAT.exec(origin);
        var destination = {column: match[1], row: match[2]};

        destination.applyOne = function (direction) {
            if (direction == 'left') {
                destination.row -= 1;
            }
        };

        destination.apply = function (directions) {
            directions.forEach(this.applyOne);
            return this;
        };

        destination.toString = function () {
            return this.column + this.row;
        };

        return destination;
    }
}