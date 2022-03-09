var express = require('express');
var router = express.Router();
const aad = require('azure-ad-jwt');
const product = require('../models/product.model.js');

/* GET products listing. */
router.get('/', function (req, res, next) {
    token = req.headers['authorization'];
    req_token = token.split(' ');
    lastToken = req_token[1];
    product.getDetails(function (err, data) {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving product details."
            })
        } else {
            res.send(data);
        }
    })
});

router.get('/:productId', function (req, res, next) {
    token = req.headers['authorization'];
    req_token = token.split(' ');
    lastToken = req_token[1];

    product.getProductById(req.params.productId, (err, data) => {
        if (err) {
            console.log("err", err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving product details."
            })
        } else {
            res.send(data);
        }
    })
});

router.post('/add', function (req, res, next) {
    token = req.headers['authorization'];
    req_token = token.split(' ');
    lastToken = req_token[1];
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    var inputs = {
        "Products": {
            '_id': '',
            'epid': req.body.id,
            'product_id': req.body.id,
            'bottler_id': req.body.bottler_id,
            'customer_id': req.body.customer_id,
            'store_id': req.body.store_id,
            'name': req.body.name,
            'retail_price': req.body.retail_price,
            'sale_price': req.body.sale_price,
            'skuid': req.body.skuid,
            'small_image': req.body.small_image,
            'active': 'active',
            'availability': '',
            'description': req.body.description,
            'promotion': '',
            'size': '',
            'configuration': '',
            'color': '',
            'picture': '',
            'contract': '',
            'store': '',
            'created_at': new Date().toLocaleString(),
            'ReturnCode': ''
        }
    };
    // Save Product in the database
    product.create(inputs, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Product."
            });
        else res.send(data);
    });
})

router.post('/update', function (req, res, next) {
    token = req.headers['authorization'];
    req_token = token.split(' ');
    lastToken = req_token[1];
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    var inputs = {
        "Products": {
            'id': req.body.id,
            '_id': '',
            'epid': req.body.id,
            'product_id': req.body.id,
            'bottler_id': req.body.bottler_id,
            'customer_id': req.body.customer_id,
            'store_id': req.body.store_id,
            'name': req.body.name,
            'retail_price': req.body.retail_price,
            'sale_price': req.body.sale_price,
            'skuid': req.body.skuid,
            'small_image': req.body.small_image,
            'active': 'active',
            'availability': '',
            'description': req.body.description,
            'promotion': '',
            'size': '',
            'configuration': '',
            'color': '',
            'picture': '',
            'contract': '',
            'store': '',
            'created_at': new Date().toLocaleString(),
            'ReturnCode': req.body.ReturnCode
        }
    };

    product.update(inputs,
        (err, data) => {
            if (err) {
                res.status(500).send({
                    message: "Some error occurred while updating product."
                });
            } else res.send(data);
        }
    );
})

router.post('/bulkimport', function (req, res, next) {
    token = req.headers['authorization'];
    req_token = token.split(' ');
    lastToken = req_token[1];

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    var bulkData = req.body.data;
    bulkData = JSON.parse(bulkData);
    inserted_rows = 0;
    not_inserted_rows = 0;
    insertData(bulkData)
        .then(response => {
            setTimeout(() =>
                res.send({ "message": inserted_rows + " row's affected." + not_inserted_rows + " rows's getting error to insert." })
                , 2000)
        })
})

router.post('/delete', function (req, res, next) {

    var inputs = {
        "Products": {
            'id': req.body.id,
            'active': 'inactive',
        }
    };

    product.delete(inputs,
        (err, data) => {
            if (err) {
                res.status(500).send({
                    message: "Some error occurred while deleting product."
                });
            } else res.send(data);
        }
    );
})

async function insertData(bulkData) {
    for (var i = 0; i < bulkData.Products.length; i++) {

        var inputs = { "Products": bulkData.Products[i] }
        product.import(inputs, (err, data) => {
            if (err) {
                not_inserted_rows = not_inserted_rows + 1;
            } else {
                inserted_rows = inserted_rows + 1;
            }
        });
    }
    return true;
}

module.exports = router;
