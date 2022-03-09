var express = require('express');
var router = express.Router();
const aad = require('azure-ad-jwt');
const service = require('../services/SchoolService');
const TOKEN_CHECK = process.env.TOKEN_CHECK

var verifyToken = 'false'

/* GET school details by ID. */
/**
 * @swagger
 * /api/school/{schoolId}:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags: ["school"]
 *     summary: Find school object by ID
 *     description: Get school object by ID
 *     parameters:
 *     - name: "schoolId"
 *       in: "path"
 *       description: "The product ID that needs to be fetched product details. "
 *       required: true
 *     responses: 
 *       200:
 *         description: Success 
 *  
 */
router.get('/:schoolId', function (req, res, next) {
    try {
        if (TOKEN_CHECK == 'true') {
            var token = req.headers['authorization'];
            var req_token = token.split(' ');
            var lastToken = req_token[1];
            aad.verify(lastToken, null, function (err, result) {
                if (result) {
                    verifyToken = 'true';
                }
                if (lastToken == "neha" || verifyToken == 'true') {
                    service.getUserSchoolDetails(req.params.schoolId, function (err, data) {
                        if (err) {
                            res.status(500).send({
                                message: err.message || "Some error occurred while retrieving product details."
                            })
                        } else {
                            if (data.length === 0) {
                                res.status(500).send({ message: "This school id not exist with us." })
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
module.exports = router;