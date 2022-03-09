const { Connection, Request } = require("tedious");
var TYPES = require('tedious').TYPES;
const dbConfig = require('../../config/db.config');
const pModel = require('../models/product')

module.exports={
    getAllProducts: function (result, callback) {
        const connection = new Connection(dbConfig);
    
        let jsonFormat = []
        let rowData = {};
    
        connection.connect(function (err) {
            if (err) {
                console.error(err);
            } else {
                const request = new Request('GetProducts',
                    (err, recordset, rows) => {
                        if (err) {
                            result(err, null);
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
    },

    getProductById: function (productId, result) {
        const connection = new Connection(dbConfig);
        rowData = {}
    
        connection.connect(function (err) {
            if (err) {
                console.error(err);
            } else {
                const request = new Request('GetProduct',
                    (err, recordset, rows) => {
                        if (err) {
                            result(err, null);
                        } else {
                            result(null, rowData)
                        }
                    })
                request.addParameter('productId', TYPES.VarChar, productId)
                request.on("row", columns => {
                    columns.forEach(column => {
                        // IMPORTANT: Change the conversion logic here to adjust JSON format
                        rowData[column.metadata.colName] = column.value;
                    });
                });
                connection.callProcedure(request);
            }
        })
    },

    addProduct: async function (newProduct, result) {
        const connection = new Connection(dbConfig);
        const productModel = await pModel.getPModel(newProduct);
    
        rowData = {}
        connection.connect(function (err) {
            if (err) {
                console.error(err);
            } else {
                const request = new Request('BatchInsertProducts',
                    (err, recordset, rows) => {
                        if (err) {
                            result(err, null);
                        } else {
                            result(null, rowData)
                        }
                    })
    
                request.addParameter('jsonObject', TYPES.NVarChar, JSON.stringify(productModel))
                request.on("row", columns => {
                    columns.forEach(column => {
                        // IMPORTANT: Change the conversion logic here to adjust JSON format
                        rowData[column.metadata.colName] = column.value;
                    });
                });
                connection.callProcedure(request);
            }
        })
    },

    updateProduct: async function(updatedData, result) {
        const connection = new Connection(dbConfig);
        const productModel = await pModel.getPModel(updatedData);
    
        rowData = {}
        connection.connect(function (err) {
            if (err) {
                console.error(err);
            } else {
                const request = new Request('BatchUpdateProducts',
                    (err, recordset, rows) => {
                        if (err) {
                            result(err, null);
                        } else {
                            result(null, rowData)
                        }
                    })
    
                request.addParameter('jsonObject', TYPES.NVarChar, JSON.stringify(productModel))
                request.on("row", columns => {
                    columns.forEach(column => {
                        // IMPORTANT: Change the conversion logic here to adjust JSON format
                        rowData[column.metadata.colName] = column.value;
                    });
                });
                connection.callProcedure(request);
            }
        })
    },

    deleteProduct: function (req, result) {
        const connection = new Connection(dbConfig);
        var deletedData = {
            "Products": {
                'id': req.productId,
                'active': 'inactive',
            }
        };
        rowData = {}
        connection.connect(function (err) {
            if (err) {
                console.error(err);
            } else {
                const request = new Request('BatchDeleteProducts',
                    (err, recordset, rows) => {
                        if (err) {
                            result(err, null);
                        } else {
                            result(null, rowData)
                        }
                    })
    
                request.addParameter('jsonObject', TYPES.NVarChar, JSON.stringify(deletedData))
                request.on("row", columns => {
                    columns.forEach(column => {
                        // IMPORTANT: Change the conversion logic here to adjust JSON format
                        rowData[column.metadata.colName] = column.value;
                    });
                });
                connection.callProcedure(request);
            }
        })
    }
}

