const { Connection, Request } = require("tedious");
var TYPES = require('tedious').TYPES;
const dbConfig = require('../config/db.config');

exports.getDetails = function (result, callback) {
    const connection = new Connection(dbConfig);

    let jsonFormat = []
    let rowData = {};

    connection.connect(function (err) {
        if (err) {
            console.error(err);
        } else {
            const request = new Request('GetFiles',
                (err, recordset, rows) => {
                    if (err) {
                        console.error(err);
                    } else {
                        result(null, jsonFormat)
                    }
                })

            request.on("row", columns => {
                rowData = {};
                columns.forEach(column => {
                    // IMPORTANT: Change the conversion logic here to adjust JSON format
                    rowData[column.metadata.colName] = column.value;
                });
                jsonFormat.push(rowData);
            });
            connection.execSql(request);
        }
    });
}

exports.add = (newFile, storageUrl, result) => {
    const connection = new Connection(dbConfig);
    var fileName = newFile.name;
    var subPath = storageUrl
    var fileSize = newFile.size  / (1024)

    rowData = {}
    connection.connect(function (err) {
        if (err) {
            console.error(err);
        } else {
            const request = new Request('saveFile',
                (err, recordset, rows) => {
                    if (err) {
                        console.error(err);
                    } else {
                        result(null, rowData)
                    }
                })

            request.addParameter('id', TYPES.Int, '')
            request.addParameter('name', TYPES.NVarChar, fileName)
            request.addParameter('size', TYPES.Float, fileSize)
            request.addParameter('processed', TYPES.NVarChar, "Not yet processed")
            request.addParameter('url', TYPES.NVarChar, subPath)
            request.addParameter('isActive', TYPES.NVarChar, "true")
            request.addParameter('ReturnCode', TYPES.NVarChar, '1')
            request.on("row", columns => {
                columns.forEach(column => {
                    // IMPORTANT: Change the conversion logic here to adjust JSON format
                    rowData[column.metadata.colName] = column.value;
                });
            });
            connection.callProcedure(request);
        }
    })
};