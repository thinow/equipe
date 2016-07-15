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
                .to.have.deep.property('weeks.w24.reference').that.eql("A2");
            expect(result)
                .to.have.deep.property('weeks.w24.number').that.eql('w24');
            expect(result)
                .to.have.deep.property('weeks.w24.label').that.eql("First week");
            expect(result)
                .to.have.deep.property('weeks.w24.days.B3.reference').that.eql("B3");
            expect(result)
                .to.have.deep.property('weeks.w24.days.B3.date').that.eql(new Date('2016-06-13'));
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

        it("Fetch days from references", function () {
            // given
            var xlsx = parser.readAsXlsx(readTestFile());

            // when
            var result = parser.fetchDays({xlsx: xlsx, sheet: 'Sheet1', references: ['B3', 'B19']});

            // then
            expect(result).to.eql([
                {reference: 'B3', date: new Date('2016-06-13')},
                {reference: 'B19', date: new Date('2016-06-17')}
            ]);
        });

        it("Fetch weeks from references", function () {
            // given
            var xlsx = parser.readAsXlsx(readTestFile());

            // when
            var result = parser.fetchWeeks({xlsx: xlsx, sheet: 'Sheet1', references: ['B3', 'B19', 'B25', 'B29']});

            // then
            expect(result)
                .to.have.deep.property('w24.reference').that.eql('A2');
            expect(result)
                .to.have.deep.property('w24.number').that.eql('w24');
            expect(result)
                .to.have.deep.property('w24.label').that.eql('First week');
            expect(result)
                .to.have.deep.property('w24.firstDay').that.eql('B3');
            expect(result)
                .to.have.deep.property('w24.days.B3').that.eql({reference: 'B3', date: new Date('2016-06-13')});
            expect(result)
                .to.have.deep.property('w24.days.B19').that.eql({reference: 'B19', date: new Date('2016-06-17')});

            expect(result)
                .to.have.deep.property('w25.reference').that.eql('A24');
            expect(result)
                .to.have.deep.property('w25.number').that.eql('w25');
            expect(result)
                .to.have.deep.property('w25.label').that.eql('Second week');
            expect(result)
                .to.have.deep.property('w25.firstDay').that.eql('B25');
            expect(result)
                .to.have.deep.property('w25.days.B25').that.eql({reference: 'B25', date: new Date('2016-06-22')});
            expect(result)
                .to.have.deep.property('w25.days.B29').that.eql({reference: 'B29', date: new Date('2016-06-23')});
        });

        it("Cell: text value", function () {
            // given
            var xlsx = parser.readAsXlsx(readTestFile());

            // when
            var value = parser.cell({xlsx: xlsx, sheet: 'Sheet1', type: 'text', ref: 'A17'});

            // then
            expect(value).to.eql('Meeting at 10am');
        });

        it("Cell: date value", function () {
            // given
            var xlsx = parser.readAsXlsx(readTestFile());

            // when
            var value = parser.cell({xlsx: xlsx, sheet: 'Sheet1', type: 'date', ref: 'A4'});

            // then
            expect(value).to.eql(new Date('2016-06-13'));
        });
    });
});
