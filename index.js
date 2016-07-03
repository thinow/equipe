var express = require('express');
var busboy = require('connect-busboy');
var upload = require('./lib/upload');
var parser = require('./lib/parser');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(busboy());
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    response.writeHead(302, {'Location': 'upload.html'});
    response.end();
});

app.post('/api/upload', function (request, response) {
    console.log("API: upload");

    var handleError = function (error) {
        console.log("API: error during upload");
        console.error(error);
        response.status(500).send(error.message);
    };

    upload(request, {
        onSuccess: function (data) {
            try {
                var result = parser.parse(data);
                console.log("API: successfully parsed. Result = %j", result);

                response.end();
            } catch (cause) {
                handleError(cause);
            }
        },
        onError: handleError
    });
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
