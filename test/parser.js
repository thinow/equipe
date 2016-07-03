var expect = require("chai").expect;
var parser = require("../lib/parser");

describe("Excel files parser", function () {
    it("result is an array", function () {
        var data = undefined;
        expect(parser.parse(data)).to.be.a('array');
    });
});
