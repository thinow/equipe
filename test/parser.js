var expect = require("chai").expect;
var parser = require("../lib/parser");
var fs = require('fs');

describe("Excel files parser", function () {

    function readTestFile() {
        return fs.readFileSync(__dirname + '/resources/test-file.xlsx');
    }

    describe("Integration tests", function () {

        it("Can parse test file", function () {
            // when
            var result = parser.parse(readTestFile());

            // then
            expect(result).to.exist;
        });
    });

    describe("Unit tests", function () {

        it("Cannot parse undefined", function () {
            expect(function () {
                parser.parse(undefined)
            }).to.throw(ReferenceError);
        });

        it("Read as an Excel file", function () {
            // when
            var result = parser.readAsXlsx(readTestFile());

            // then
            expect(result).to.have.deep.property('SheetNames[0]', 'Sheet1');
        });
    });
});
