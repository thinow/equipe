var express = require('express');
var busboy = require('connect-busboy');
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
    console.log("Upload: start.");

    request.pipe(request.busboy);
    request.busboy.on('file', function (fieldname, file, filename) {
        console.log("Upload: event FILE. filename=%s", filename);

        var chunks = [];
        file.on('data', function (chunk) {
            console.log("Upload: data DATA. length=%s", chunk.length);
            chunks.push(chunk);
        });
        file.on('end', function () {
            console.log("Upload: event END.");

            try {
                var buffer = Buffer.concat(chunks);

                var object = xlsx.read(buffer);
                object.SheetNames.forEach(function (name) {
                    var sheet = object.Sheets[name];
                    var cell = sheet.A2;
                    console.log("Upload : Sheet = %s, Cell value = %j", name, cell);
                    response.send(cell.v);
                });
            } catch (cause) {
                next(cause);
            }
        });

    });
});

// Handle errors
app.use(function (error, request, response, next) {
    if (error) {
        console.error(error);
        response.status(500).send("Internal server error");
    }
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
