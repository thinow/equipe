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
            var result = parser.parse(readTestFile(), {anchor: /must/i});

            // then
            expect(result)
                .to.have.deep.property('weeks.25.reference').that.eql("A2");
            expect(result)
                .to.have.deep.property('weeks.25.number').that.eql(25);
            expect(result)
                .to.have.deep.property('weeks.25.label').that.eql("First week");
            expect(result)
                .to.have.deep.property('weeks.25.days.B3.reference').that.eql("B3");
            expect(result)
                .to.have.deep.property('weeks.25.days.B3.date').that.eql(new Date('2016-06-13'));
        });
    });

    describe("Unit tests", function () {

        it("Cannot parse undefined", function () {
            expect(function () {
                parser.parse(undefined);
            }).to.throw(Error);
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
            var anchors = parser.findAnchors({xlsx: xlsx, sheet: 'Sheet1', regexp: /must/i});

            // then
            expect(anchors).to.have.members(['B3', 'B7', 'B11', 'B15', 'B19', 'B25', 'B29']);
        });

        it("Fetch dates from references", function () {
            // given
            var xlsx = parser.readAsXlsx(readTestFile());

            // when
            var result = parser.fetchDates({xlsx: xlsx, sheet: 'Sheet1', references: ['B3', 'B19']});

            // then
            expect(result).to.eql([
                {reference: 'B3', date: new Date('2016-06-13')},
                {reference: 'B19', date: new Date('2016-06-17')}
            ]);
        });

        it("Fetch date cell", function () {
            // given
            var xlsx = parser.readAsXlsx(readTestFile());

            // when
            var date = parser.cell({xlsx: xlsx, sheet: 'Sheet1', type: 'date', ref: 'A4'});

            // then
            expect(date).to.eql(new Date('2016-06-13'));
        });
    });
});
