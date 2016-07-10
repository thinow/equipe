var expect = require("chai").expect;
var browse = require("../lib/browser").browse();

describe("Browse cells references", function () {

    describe("Correct parameters", function () {
        it("SourceRef as string", function () {
            expect(function () {
                var unexpectedArrayValue = [];
                browse({from: unexpectedArrayValue, to: ['left']});
            }).to.throw(Error);
        });

        it("Directions as array", function () {
            expect(function () {
                browse({from: 'B2', to: 'unexpected-string'});
            }).to.throw(Error);
        });
    });

    it("No direction, same reference", function () {
        expect(browse({from: 'B2', to: []})).to.equal('B2');
    });

    it("Left neighbor", function () {
        expect(browse({from: 'B2', to: ['left']})).to.equal('A2');
    });

    it("Bottom neighbor", function () {
        expect(browse({from: 'B2', to: ['down']})).to.equal('B3');
    });

    it("Combination: left down", function () {
        expect(browse({from: 'B2', to: ['left', 'down']})).to.equal('A3');
    });

    it("Reach left limit", function () {
        expect(function () {
            browse({from: 'A1', to: ['left']});
        }).to.throw(Error);
    });

    it("Unknown FORMAT", function () {
        expect(function () {
            browse({from: 'UNKNOWN-FORMAT', to: ['left']});
        }).to.throw(Error);
    });

    it("Unknown direction", function () {
        expect(function () {
            browse({from: 'B2', to: ['UNKNOWN']});
        }).to.throw(Error);
    });

});
