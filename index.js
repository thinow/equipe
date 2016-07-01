var express = require('express');
var busboy = require('connect-busboy');
var xlsx = require('xlsx');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(busboy());

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    response.send('Hello!');
});

app.post('/api/upload', function (request, response) {
    console.log("Upload: start.");
    
    try {
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

                var buffer = Buffer.concat(chunks);

                try {
                    var object = xlsx.read(buffer);
                    object.SheetNames.forEach(function (name) {
                        var sheet = object.Sheets[name];
                        console.log("Upload : Sheet = %s, Cell value = %j", name, sheet.A2);
                    });

                    response.sendStatus(200);
                } catch (error) {
                    console.error("Error on upload...");
                    console.error(error);
                }
            });

        });
    } catch (cause) {
        console.error('Error on upload', cause);
    }
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
