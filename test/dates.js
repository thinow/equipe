var assert = require("assert");
var expect = require("chai").expect;
var dates = require("../lib/dates");

describe("Dates methods", function () {

    describe("Excel values", function () {
        it("Cannot convert the wrong type", function () {
            expect(function () {
                dates.fromExcelValue('not-a-number');
            }).to.throw(Error);
        });

        it("One date", function () {
            expect(dates.fromExcelValue(42534)).to.eql(new Date("2016-06-13"));
        });

        it("Another date", function () {
            expect(dates.fromExcelValue(31650)).to.eql(new Date("1986-08-26"));
        });
    });

    describe("Week", function () {
        it("One week", function () {
            expect(dates.findWeek(new Date("2016-06-13"))).to.eql(24);
            expect(dates.findWeek(new Date("2016-06-19"))).to.eql(24);
        });

        it("Another week", function () {
            expect(dates.findWeek(new Date("2016-06-20"))).to.eql(25);
            expect(dates.findWeek(new Date("2016-06-26"))).to.eql(25);
        });
    });

});
