var express = require('express');
var busboy = require('connect-busboy');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(busboy());

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    response.send('Hello!');
});

app.post('/api/upload', function (request, response) {

    try {
        request.pipe(request.busboy);
        request.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploaded: " + filename);

            var chunks = [];
            file.on('data', function (chunk) {
                chunks.push(chunk);
            });
            file.on('end', function () {
                var body = Buffer.concat(chunks);
                console.log("Data: " + body.length);
            });

        });

        response.sendStatus(200);
    } catch (cause) {
        console.error('Error on upload', cause);
    }
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
