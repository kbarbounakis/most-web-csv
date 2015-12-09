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

CsvPostHandler.prototype.postMapRequest = function(context, callback) {
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
                if (file.type !== 'text/csv' && file.type !=='application/vnd.ms-excel') {
                    return callback();
                }

                /**
                 * @type DataModel
                 */
                var model;
                if (context.request && context.request.route) {
                    var controller = context.request.route.data("controller");
                    if (controller) {
                        model = context.model(controller);
                    }
                }
                var stream = fs.createReadStream(file.path);
                var arr = [], headers = [], i, x, field;
                var csvStream = csv()
                    .on("data", function(data){
                        if (headers.length==0) {
                            //prepare headers
                            if (typeof model === 'undefined' || model==null) {
                                headers = data.map(function(y) { return { name:y } });
                            }
                            else {
                                data.forEach(function(y) {
                                    field = model.attributes.find(function(z) {
                                        //create regular expression with field name or field title
                                        var re = new RegExp('^' + z.name + '$|^' + z.title + '$','i');
                                        //test header
                                        return re.test(y);
                                    });
                                    if (field) {
                                        headers.push(field);
                                    }
                                    else {
                                        headers.push({ name:y });
                                    }
                                });
                            }
                        }
                        else {
                            x = { };
                            for ( i = 0; i < data.length; i++) {
                                if (headers[i]) {
                                    x[headers[i].name] = data[i];
                                }

                            }
                            arr.push(x);
                        }
                    })
                    .on("end", function() {
                        if (model) {
                            context.params.data = arr;
                        }
                        return callback();
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