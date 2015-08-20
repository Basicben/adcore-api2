// connect to sql.
var Connection = require('tedious').Connection;
var connection = new Connection(GLOBAL.conf.dbconfig.mssql);
connection.on('connect', function (err) {
    // If no error, then good to proceed.
    if (err == undefined) {
        console.log("Connected");
    } else {
        console.log('connect err', err);
    }
});

// get require objects.
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// public function implemantation.
var mssqlHelper = {
    query: function (query, callback, errCallback) {
        // creating request obj
        request = new Request(query, function (err) {
            if (err) {
                // send callback if exsists
                if (errCallback != undefined && typeof (errCallback) === 'function')
                    errCallback(err);
                return;
            }
        });
        // creating the result object && fill it by row event.
        jsonArray = [];
        request.on('row', function (columns) {
            var rowObject = {};
            columns.forEach(function (column) {
                rowObject[column.metadata.colName] = column.value;
            });
            jsonArray.push(rowObject);
        });
        // done resiving data event -> send to callback.
        request.on('doneProc', function (rowCount, more) {
            console.log(jsonArray.length);
            // send callback if exsists
            if (callback != undefined && typeof (callback) === 'function')
                callback(jsonArray, rowCount);
        });
        // execute the request.
        connection.execSql(request);
    },
    dynamic: function (name, params, callback, errCallback) {
        // creating request obj
        request = new Request(name, function (err) {
            if (err) {
                // send callback if exsists
                if (errCallback != undefined && typeof (errCallback) === 'function')
                    errCallback(err);
                return;
            }
        });
        // adding params to the request        
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (param.name != undefined && param.name != '') {
                switch (param.mode) {
                    case 'output':
                        request.addOutputParameter(param.name, param.type || TYPES.VarChar);
                        break;
                    case 'table':
                        request.addParameter('tvp', TYPES.TVP, table);
                        break;
                    case 'input':
                    default:
                        request.addParameter(param.name, param.type || TYPES.VarChar, param.value || '');

                }
            }
        }
        // creating the result object && fill it by row event.
        jsonArray = [];
        request.on('row', function (columns) {
            var rowObject = {};
            columns.forEach(function (column) {
                rowObject[column.metadata.colName] = column.value;
            });
            jsonArray.push(rowObject);
        });
        // done resiving data event -> send to callback.
        request.on('doneProc', function (rowCount, more) {
            console.log(jsonArray.length);
            // send callback if exsists
            if (callback != undefined && typeof (callback) === 'function')
                callback(jsonArray, rowCount);
        });
        // execute the request.
        connection.execSql(request);
    }, 
    sp: function (name, params, callback, errCallback) {
        // creating request obj
        request = new Request(name, function (err) {
            if (err) {
                // send callback if exsists
                if (errCallback != undefined && typeof (errCallback) === 'function')
                    errCallback(err);
                return;
            }
        });
        // adding params to the request        
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (param.name != undefined && param.name != '') {
                switch (param.mode) {
                    case 'output':
                        request.addOutputParameter(param.name, param.type || TYPES.VarChar);
                        break;
                    case 'table':
                        request.addParameter('tvp', TYPES.TVP, table);
                        break;
                    case 'input':
                    default:
                        request.addParameter(param.name, param.type || TYPES.VarChar, param.value || '');

                }
            }
        }
        // creating the result object && fill it by row event.
        jsonArray = [];
        request.on('row', function (columns) {
            var rowObject = {};
            columns.forEach(function (column) {
                rowObject[column.metadata.colName] = column.value;
            });
            jsonArray.push(rowObject);
        });
        // done resiving data event -> send to callback.
        request.on('doneProc', function (rowCount, more) {
            console.log(jsonArray.length);
            // send callback if exsists
            if (callback != undefined && typeof (callback) === 'function')
                callback(jsonArray, rowCount);
        });
        // execute the request.
        connection.callProcedure(request);
    },
    bulk: function (tableName, columns, rows, callback, errCallback) {
        // instantiate - provide the table where you'll be inserting to, and a callback
        var bulkLoad = connection.newBulkLoad(tableName, function (error, rowCount) {
            console.log('inserted %d rows', rowCount);
        });
        // setup your columns - always indicate whether the column is nullable
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if (column != undefined && column.name != undefined && column.name != '')
                bulkLoad.addColumn(column.name, column.type || TYPES.VarChar, column.options || { nullable: true });
        }
        // setup your columns - always indicate whether the column is nullable
        for (var i = 0; i < rows.length; i++) {
            bulkLoad.addRow(rows[i]);              
        }
        // execute
        connection.execBulkLoad(bulkLoad);
    }
}

module.exports = mssqlHelper;


/*
 * Basic Usage:
 * var db = require(XXXXX);
 * 
 * db.query("SELECT * FROM [TABLE_NAME] WHERE ...", 
 *          function(data, rowCount){ 
 *               DO SHIT
 *          },
 *          function(err){
 *               WRITE LOG OR ERROR HANDELING   
 *          });
 * 
 * db.sp("sp_some_procedure", [{name:'Id', type: TYPE.Int, value: 550, mode: 'input'},{name:'name', type: TYPE.VarChar, value: null, mode: 'output'}],
 *          function(data, rowCount){ 
 *               DO SHIT
 *          },
 *          function(err){
 *               WRITE LOG OR ERROR HANDELING   
 *          });
 * 
 * db.sp("SELECT * FROM [TABLE_NAME] WHERE name = @name AND id = @id", [{name:'Id', type: TYPE.Int, value: 550, mode: 'input'},{name:'name', type: TYPE.VarChar, value: null, mode: 'output'}],
 *          function(data, rowCount){ 
 *               DO SHIT
 *          },
 *          function(err){
 *               WRITE LOG OR ERROR HANDELING   
 *          });
 * 
 * 
 */