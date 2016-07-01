module.exports = function (request) {
    var self = {
        callbacks: {},

        on: function (event, callback) {
            self.callbacks[event] = callback;
            return self;
        },

        start: function () {
            console.log('UPLOAD: start');

            request.pipe(request.busboy);
            request.busboy.on('file', function (fieldname, file, filename) {
                console.log("UPLOAD: event FILE. filename=%s", filename);

                var chunks = [];
                file.on('data', function (chunk) {
                    console.log("UPLOAD: event DATA. length=%s", chunk.length);
                    chunks.push(chunk);
                });
                file.on('end', function () {
                    console.log("UPLOAD: event END.");

                    try {
                        var data = Buffer.concat(chunks);
                        self.callbacks['uploaded'](data);
                    } catch (error) {
                        self.callbacks['error'](error);
                    }
                });

            });
        }
    };
    return self;
};