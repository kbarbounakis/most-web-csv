/**
 * MOST Web Framework
 * A JavaScript Web Framework
 * http://themost.io
 *
 * Copyright (c) 2014, Kyriakos Barbounakis k.barbounakis@gmail.com, Anthi Oikonomou anthioikonomou@gmail.com
 *
 * Released under the BSD3-Clause license
 * Date: 2015-09-14
 */
var util = require('util');

function HttpCsvResult(data)
{
    this.data = data;
    this.contentType = 'application/csv;charset=utf-8';
    this.contentEncoding = 'utf8';
}

HttpCsvResult.prototype.execute = function(context, callback) {
    var self = this,
        csv = require('fast-csv');
    try {
        if (!util.isArray(this.data)) {
            context.response.writeHead(422);
            return callback.call(context);
        }
        context.response.writeHead(this.responseStatus || 200, { "Content-Type": this.contentType });
        csv.writeToString(this.data, { headers: true, transform: function(row){
            var keys = Object.keys(row);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i], header;
                if (typeof self.header === 'function') {
                    header = self.header(key);
                }
                if (typeof row[key] === 'object' && row[key] != null && !(row[key] instanceof Date)) {
                    if (row[key].name) {
                        row[key] = row[key].name;
                    }
                }
                if (header && key!==header) {
                    row[header]=row[key];
                    delete row[key];
                }
            }
            return row;
        }}, function(err, data) {
            if (err) {
                callback.call(context, err);
            }
            else {
                context.response.write(data, self.contentEncoding);
                callback.call(context);
            }
        });
    }
    catch(e) {
        callback.call(context);
    }
};

if (typeof exports !== 'undefined') {
    module.exports = {
        /**
         * @constructs HttpCsvResult
         */
        HttpCsvResult:HttpCsvResult
    };
}
