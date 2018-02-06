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
var LangUtils = require('@themost/common/utils').LangUtils;
var RandomUtils = require('@themost/common/utils').RandomUtils;
var HttpResult = require('@themost/web/mvc').HttpResult;
var _ = require('lodash');
var csv = require('fast-csv');
var moment = require('moment');

function HttpCsvResult(data)
{
    this.data = data;
    this.contentType = 'application/csv;charset=utf-8';
    this.contentEncoding = 'utf8';
    this.filename = RandomUtils.randomChars(12).toUpperCase() + '.csv';
}
LangUtils.inherits(HttpCsvResult, HttpResult);

HttpCsvResult.prototype.execute = function(context, callback) {
    var self = this;
    try {
        if (!_.isArray(this.data)) {
            context.response.writeHead(422);
            return callback();
        }
        context.response.writeHead(this.responseStatus || 200, {
            "Content-Type": this.contentType,
            "Content-Disposition": "filename=" + this.filename
        });
        csv.writeToString(this.data, {
            headers: true,
            transform: function(row) {
                var keys = _.keys(row);
                var res ={};
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    res[key] = row[key];
                    var header;
                    if (typeof self.header === 'function') {
                        header = self.header(key);
                    }
                    if (typeof res[key] === 'object' && res[key] != null && !(res[key] instanceof Date)) {
                        if (res[key].name) {
                            res[key] = res[key].name;
                        }
                    }
                    else if (res[key] instanceof Date) {
                        res[key] = moment(res[key]).locale(context.culture()).format('L LTS');
                    }
                    if (header && key!==header) {
                        res[header]=res[key];
                        delete res[key];
                    }
                }
                return res;
            }
        }, function(err, data) {
            if (err) {
                return callback(err);
            }
            context.response.write(data, self.contentEncoding);
            return callback();
        });
    }
    catch(err) {
        return callback(err);
    }
};

if (typeof exports !== 'undefined') {
    module.exports.HttpCsvResult = HttpCsvResult;
}
