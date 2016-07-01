var express = require('express');
var busboy = require('connect-busboy');
var upload = require('./lib/upload');
var xlsx = require('xlsx');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(busboy());
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    response.writeHead(302, {'Location': 'upload.html'});
    response.end();
});

app.post('/api/upload', function (request, response, next) {
    console.log("API: upload");

    upload(request)
        .on('uploaded', function (data) {
            var parsed = xlsx.read(data);
            parsed.SheetNames.forEach(function (name) {
                var sheet = parsed.Sheets[name];
                var cell = sheet.A2;
                console.log("Upload : Sheet = %s, Cell value = %j", name, cell);
                response.send(cell.v);
            });
        })
        .on('error', function (error) {
            next(error);
        })
        .start();
});

// Handle errors
app.use(function (error, request, response, next) {
    if (error) {
        console.log("API: upload");
        console.error(error);
        response.status(500).send(error.message);
    }
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
