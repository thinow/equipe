var assert = require("assert");
var expect = require("chai").expect;
var take = require("../lib/assertions").take();

describe("Assertions methods", function () {

    it("Take : never accept undefined", function () {
        expect(function () {
            take(undefined);
        }).to.throw(assert.AssertionError);
    });

    it("Type : return value if type is expected", function () {
        // when
        var value = take('text').ifTypeIs('string');

        // then
        expect(value).to.equal('text');
    });

    it("Type : error if type is wrong", function () {
        expect(function () {
            take('text').ifTypeIs('array');
        }).to.throw(assert.AssertionError);
    });

});
