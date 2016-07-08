var xlsx = require('xlsx');

module.exports = {
    parse: function (data) {
        if (data == undefined) {
            throw new ReferenceError();
        }

        return this.readAsXlsx(data);
    },

    readAsXlsx: function (data) {
        return xlsx.read(data);
    }
}