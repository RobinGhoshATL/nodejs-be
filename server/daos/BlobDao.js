const { BlobServiceClient } = require('@azure/storage-blob');
var azure = require('azure-storage');
const AZURE_STORAGE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
const AZURE_STORAGE_KEY =  process.env.AZURE_STORAGE_KEY;
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

var AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;

module.exports= {
    getAllBlobs: async function (result, callback) {
        const data= [];
        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        
        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
        
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
            myObj.url = 'https://rsgblobstorage.blob.core.windows.net/' + AZURE_STORAGE_CONTAINER_NAME + '/' + blob.name;
            
            data.push(myObj);
        } // end for
        //res.json(data);  
        result(null, data)
    },

    addBlob: async function (req, callback) {
        var base64Blob = req.body.binary
  
        var base64Data = base64Blob.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var type = base64Data[1];
        const buffer = Buffer.from(base64Data[2], "base64"); //convert base64 to buffer
        const blobName = "newblob" + new Date().getTime();
        try {
          var blobService = azure.createBlobService(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY);
          await blobService.createBlockBlobFromText(AZURE_STORAGE_CONTAINER_NAME, blobName, buffer, { contentSettings: { contentType: type } }, function (error, result, response) {
            if (error) {
              callback(error, null)
            } else {
              callback(null, result)

            }
          });
        }
        catch (e) {
          console.log('Catch an error: ', e)
        }
      
    }

}
