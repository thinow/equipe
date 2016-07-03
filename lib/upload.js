module.exports = function (request, callbacks) {
    console.log('UPLOAD: start');

    request.pipe(request.busboy);
    request.busboy.on('file', function (fieldname, file, filename) {
        console.log("UPLOAD: event FILE. filename=%s", filename);

        var chunks = [];
        file
            .on('data', function (chunk) {
                console.log("UPLOAD: event DATA. length=%s", chunk.length);
                chunks.push(chunk);
            })
            .on('end', function () {
                console.log("UPLOAD: event END.");

                try {
                    var data = Buffer.concat(chunks);
                    callbacks.onSuccess(data);
                } catch (error) {
                    callbacks.onError(error);
                }
            });

    });
};