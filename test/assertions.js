var assert = require("assert");
var expect = require("chai").expect;
var take = require("../lib/assertions").take();

describe("Assertions methods", function () {

    it("Never accept undefined", function () {
        expect(function () {
            take(undefined);
        }).to.throw(assert.AssertionError);
    });

    describe("Type", function () {
        it("Return value if type is expected", function () {
            // when
            var value = take('text').ifTypeIs('string');

            // then
            expect(value).to.equal('text');
        });

        it("Error if type is wrong", function () {
            expect(function () {
                take('text').ifTypeIs('array');
            }).to.throw(assert.AssertionError);
        });
    });

    describe("Regular expression", function () {
        it("Return value if matches the regexp", function () {
            // when
            var value = take('Text').ifMatches(/[A-Z]+/i);

            // then
            expect(value).to.equal('Text');
        });

        it("Error if does not match", function () {
            expect(function () {
                take('Text').ifMatches(/WONT-MATCH/);
            }).to.throw(assert.AssertionError);
        });
    });

    describe("Array", function () {
        it("Return value if includes only expected", function () {
            // when
            var value = take(['B', 'A']).ifIncludesOnly(['A', 'B', 'C']);

            // then
            expect(value).to.eql(['B', 'A']);
        });

        it("Error if includes at least one unexpected value", function () {
            expect(function () {
                take(['B', 'A', 'UNEXPECTED']).ifIncludesOnly(['A', 'B', 'C'])
            }).to.throw(assert.AssertionError);
        });
    });

});
