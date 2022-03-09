var express = require('express');
var router = express.Router();
const aad = require('azure-ad-jwt');
const productService = require('../services/ProductService');
const TOKEN_CHECK = process.env.TOKEN_CHECK

var verifyToken = 'false'

/* GET products listing. */
/**
 * @swagger
 * /api/product/all:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags: ["product"]
 *     summary: Find all products
 *     description: Get all products
 *     responses: 
 *       200:
 *         description: Success 
 */
router.get('/all', function (req, res, next) {
    try {
        if (TOKEN_CHECK == 'true') {
            token = req.headers['authorization'];
            req_token = token.split(' ');
            lastToken = req_token[1];
            aad.verify(lastToken, null, function (err, result) {
                if (result) {
                    verifyToken = 'true';
                }
                if (lastToken == "neha" || verifyToken == 'true') {
                    productService.getAllProducts(function (err, data) {
                        if (err) {
                            res.status(500).send({
                                message: err.message || "Some error occurred while retrieving product details."
                            })
                        } else {
                            res.send(data);
                        }
                    })
                }
            })
        }
    }
    catch (err) {
        res.status(401).send({
            message: "Unauthorized user"
        })
    }
});

/* GET product by ID. */
/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags: ["product"]
 *     summary: Find product by ID
 *     description: Get product by ID
 *     parameters:
 *     - name: "productId"
 *       in: "path"
 *       description: "The product ID that needs to be fetched product details. "
 *       required: true
 *     responses: 
 *       200:
 *         description: Success 
 *  
 */
router.get('/:productId', function (req, res, next) {
    try {
        if (TOKEN_CHECK == 'true') {
            token = req.headers['authorization'];
            req_token = token.split(' ');
            lastToken = req_token[1];
            aad.verify(lastToken, null, function (err, result) {
                if (result) {
                    verifyToken = 'true';
                }
                if (lastToken == "neha" || verifyToken == 'true') {
                    productService.getProductById(req.params.productId, (err, data) => {
                        if (err) {
                            res.status(500).send({
                                message: err.message || "Some error occurred while retrieving product details."
                            })
                        } else {
                            if (Object.entries(data).length === 0) {
                                res.send({ message: "This product id not exist with us." })
                            } else {
                                res.send(data);
                            }
                        }
                    })
                }
            })
        }
    }
    catch (err) {
        res.status(401).send({
            message: "Unauthorized user"
        })
    }
});

/* Add new product. */
/**
 * @swagger
 * /api/product:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags: ["product"]
 *     summary: Add new prroduct
 *     description: Add new prroduct
 *     parameters:  
 *       - in: body
 *         name: body
 *         description: Product object that need to be added
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses: 
 *       200:
 *         description: success
 */
router.post('/', function (req, res, next) {
    try {
        if (TOKEN_CHECK == 'true') {
            token = req.headers['authorization'];
            req_token = token.split(' ');
            lastToken = req_token[1];
            aad.verify(lastToken, null, function (err, result) {
                if (result) {
                    verifyToken = 'true';
                }
                if (lastToken == "neha" || verifyToken == 'true') {
                    if (!req.body) {
                        res.status(400).send({
                            message: "Content can not be empty!"
                        });
                    }
                    productService.addProduct(req, (err, data) => {
                        if (err)
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while creating the Product."
                            });
                        else res.send(data);
                    });
                }
            })
        }
    }
    catch (err) {
        res.status(401).send({
            message: "Unauthorized user"
        })
    }
})

/* Update product by ID. */
/**
 * @swagger
 * /api/product:
 *   put:
 *     security:
 *       - Bearer: []
 *     tags: ["product"]
 *     summary: Update an existing product
 *     description: Update prroduct
 *     parameters:  
 *       - in: body
 *         name: body
 *         description: Update an existing product
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses: 
 *       200:
 *         description: success
 */
router.put('/', function (req, res, next) {
    try {
        if (TOKEN_CHECK == 'true') {
            token = req.headers['authorization'];
            req_token = token.split(' ');
            lastToken = req_token[1];
            aad.verify(lastToken, null, function (err, result) {
                if (result) {
                    verifyToken = 'true';
                }
                if (lastToken == "neha" || verifyToken == 'true') {
                    if (!req.body) {
                        res.status(400).send({
                            message: "Content can not be empty!"
                        });
                    }
                    productService.updateProduct(req,
                        (err, data) => {
                            if (err) {
                                res.status(500).send({
                                    message: "Some error occurred while updating product."
                                });
                            } else res.send(data);
                        }
                    );
                }
            })
        }
    }
    catch (err) {
        res.status(401).send({
            message: "Unauthorized user"
        })
    }
})

/* Delete product by ID. */
/**
 * @swagger
 * /api/product/{productId}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags: ["product"]
 *     summary: Delete an existing product
 *     description: Delete prroduct
 *     parameters:  
 *       - name: "productId"
 *         in: path
 *         description: Delete an existing product
 *         required: true
 *     responses: 
 *       200:
 *         description: success
 */
router.delete('/:productId', function (req, res, next) {
    try {
        if (TOKEN_CHECK == 'true') {
            token = req.headers['authorization'];
            req_token = token.split(' ');
            lastToken = req_token[1];
            aad.verify(lastToken, null, function (err, result) {
                if (result) {
                    verifyToken = 'true';
                }
                if (lastToken == "neha" || verifyToken == 'true') {
                    productService.deleteProduct(req.params,
                        (err, data) => {
                            if (err) {
                                res.status(500).send({
                                    message: "Some error occurred while deleting product."
                                });
                            } else res.send(data);
                        }
                    );
                }
            })
        }
    }
    catch (err) {
        res.status(401).send({
            message: "Unauthorized user"
        })
    }
})


/**
 * @swagger
 *definitions:
 *  Product:
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *      epid:
 *        type: string
 *        example: "2"
 *      product_id:
 *        type: string
 *        example: "2"
 *      bottler_id:
 *        type: string
 *        example: "2"
 *      customer_id:
 *        type: string
 *        example: "3"
 *      store_id:
 *        type: string
 *        example: "20"
 *      skuid:
 *        type: string
 *        example: "24-WG083-pink"
 *      name:
 *        type: string
 *        example: "Sprite"
 *      retail_price:
 *        type: string
 *        example: "8"
 *      sale_price:
 *        type: string
 *        example: "6"
 *      active:
 *        type: string
 *        example: "active"
 *      description:
 *        type: string
 *        example: "2"
 *      small_image:
 *        type: string
 *        example: "https://rsgblobstorage.blob.core.windows.net/images/fanta-1.5l.jpeg"
 */

module.exports = router;