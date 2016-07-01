var express = require('express');
var busboy = require('connect-busboy');
var upload = require('./lib/upload');
var parser = require('./lib/parser');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(busboy());
app.use(express.static(__dirname + '/public'));

var onError = function (error) {
    console.log("API: error");
    console.error(error);
    response.status(500).send(error.message);
}

app.get('/', function (request, response) {
    response.writeHead(302, {'Location': 'upload.html'});
    response.end();
});

app.post('/api/upload', function (request, response, next) {
    console.log("API: upload");

    upload(request, onError, function (data) {

        var result = parser.parse(data, onError);
        console.log("API: successfully parsed. Result = %j", result);

        response.end();
    });
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
