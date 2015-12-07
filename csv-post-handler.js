/**
 * MOST Web Framework
 * A JavaScript Web Framework
 * http://themost.io
 *
 * Copyright (c) 2014, Kyriakos Barbounakis k.barbounakis@gmail.com, Anthi Oikonomou anthioikonomou@gmail.com
 *
 * Released under the BSD3-Clause license
 * Date: 2014-07-02
 */

/**
 * @class CsvPostHandler
 * @constructor
 * @augments HttpHandler
 */
function CsvPostHandler() {

}


CsvPostHandler.prototype.beginRequest = function(context, callback) {
    try {
        var request = context.request;
        //extend params object (parse form data)
        if (typeof request.socket === 'undefined') {
            callback();
        }
        else {
            request.headers = request.headers || {};
            if (/^multipart\/form-data/i.test(request.headers['content-type'])) {
                var csv = require('fast-csv'), fs = require('fs');
                var file = context.params['file'];
                if (typeof file === 'undefined' || file == null) {
                    return callback();
                }
                if (file.type !== 'text/csv') {
                    return callback();
                }
                var stream = fs.createReadStream(file.path);
                var arr = [];
                var csvStream = csv()
                    .on("data", function(data){
                        arr.push(data);
                    })
                    .on("end", function(){
                        console.log(arr);
                        done();
                    });
                stream.pipe(csvStream);
            }
            else {
                callback();
            }

        }
    }
    catch  (e) {
        console.log(e);
        callback(new Error("An internal server error occured while parsing request data."));
    }

};

if (typeof exports !== 'undefined') {
    /**
     * @returns {HttpHandler}
     */
    exports.createInstance = function() {
        return new CsvPostHandler();
    };
}