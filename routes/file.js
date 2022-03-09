var express = require('express');
var router = express.Router();
const aad = require('azure-ad-jwt');
const file = require('../models/file.model.js');
const { BlobServiceClient } = require('@azure/storage-blob');
var azure = require('azure-storage');
const AZURE_STORAGE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
const AZURE_STORAGE_KEY =  process.env.AZURE_STORAGE_KEY;
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;


var containerName = "images";
var lastToken='';

router.get('/', async function (req, res, next) {
  token = req.headers['authorization'];
  req_token = token.split(' ');
  lastToken = req_token[1];
  //aad.verify(req_token[1], null, function (err, result) {
  //  if (result) {

            const data= [];
            // Create the BlobServiceClient object which will be used to create a container client
            const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
            
            // Get a reference to a container
            const containerClient = blobServiceClient.getContainerClient("images");
            
            // List the blob(s) in the container.
            for await (const blob of containerClient.listBlobsFlat()) {
              
                myObj = new Object()
                myObj.name = blob.name;
                myObj.blobType = blob.properties.blobType;
                myObj.contentType = blob.properties.contentType;
                myObj.size= blob.properties.contentLength;
                myObj.id = blob.properties.etag;
                myObj.createdOn = blob.properties.createdOn;
                myObj.lastModified = blob.properties.lastModified;
                myObj.leaseState = blob.properties.leaseState;
                myObj.leaseStatus = blob.properties.leaseStatus;
                myObj.serverEncrypted = blob.properties.serverEncrypted;

                myObj.processed = false;
                myObj.isActive = (blob.deleted === undefined ) ? false : true;
                myObj.url = 'https://rsgblobstorage.blob.core.windows.net/' + 'images' + '/' + blob.name;
                
                data.push(myObj);
            } // end for
            res.json(data);  
    }  // end if 
) 
  //}) // end result
 //}) // end       



router.get('/show', function (req, res, next) {
  var o = {}
  o['AZURE_STORAGE_CONNECTION_STRING'] = AZURE_STORAGE_CONNECTION_STRING;
  o['AZURE_STORAGE_ACCOUNT'] = AZURE_STORAGE_ACCOUNT;
  o['AZURE_STORAGE_KEY'] = AZURE_STORAGE_KEY;
  o['SQLSERVERNAME'] = process.env.SQLSERVERNAME;
  o['USERID'] = process.env.USERID;
  o['PASSWORD'] = process.env.PASSWORD;
  o['lastToken'] = lastToken;
  res.json(o);
})

router.post('/add', async function (req, res, next) {
  token = req.headers['authorization'];
  req_token = token.split(' ');
  lastToken = req_token[1];
  
      var base64File = req.body.binary

        var base64Data = base64File.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var type = base64Data[1];
        const buffer = Buffer.from(base64Data[2], "base64"); //convert base64 to buffer
        const blobName = "newblob" + new Date().getTime();
        try {
          var blobService = azure.createBlobService(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY);
          await blobService.createBlockBlobFromText(containerName, blobName, buffer, { contentSettings: { contentType: type } }, function (error, result, response) {
            if (error) {
              console.log(error);
              res.send(error);
            } else {
              res.send(result);

            }
          });
        }
        catch (e) {
          console.log('Catch an error: ', e)
        }
      
})


module.exports = router

