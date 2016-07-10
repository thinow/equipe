var take = require('../lib/assertions').take();

const format = /([A-Z]+)([0-9]+)/;

exports.browse = function () {

    return function (arguments) {
        var origin = take(arguments.from).ifTypeIs('string');
        var directions = take(arguments.to).ifTypeIs('object');

        if (!format.test(origin)) {
            throw new ReferenceError("Wrong reference format. reference=" + origin);
        }

        return createDestination(origin)
            .apply(directions)
            .toString();
    }

    function createDestination(origin) {
        var match = format.exec(origin);
        var destination = {column: match[1], row: match[2]};

        destination.applyOne = function (direction) {
            if (direction == 'left') {
                destination.row -= 1;
            } else {
                throw new ReferenceError("Unknown direction. direction=" + direction);
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