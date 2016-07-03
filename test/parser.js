var expect = require("chai").expect;
var parser = require("../lib/parser");

describe("Excel files parser", function () {

    it("Cannot parse undefined", function () {
        expect(function () {
            parser.parse(undefined)
        }).to.throw(ReferenceError);
    });

    it("Can parse data", function () {
        expect(function () {
            parser.parse('blabla');
        }).to.not.throw(Error);
    });
});
