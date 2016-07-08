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
            expect(result)
                .to.have.property('dates')
                .that.include.members(['2016-06-13', '2016-06-17', '2016-06-22', '2016-06-23'])
                .that.have.lengthOf(7);
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
            var xlsx = parser.readAsXlsx(readTestFile());

            // then
            expect(xlsx).to.have.deep.property('SheetNames[0]', 'Sheet1');
        });

        it("Find anchors", function () {
            // given
            var xlsx = parser.readAsXlsx(readTestFile());

            // when
            var anchors = parser.findAnchors({xlsx: xlsx, sheet: 'Sheet1', anchor: 'Must'});

            // then
            expect(anchors).to.have.members(['B3', 'B7', 'B11', 'B15', 'B19', 'B25', 'B29']);
        });
    });
});
