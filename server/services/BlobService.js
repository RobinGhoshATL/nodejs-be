const blobDao = require('../daos/BlobDao') 

module.exports = {
    getAllBlobs: function(request,response) {
        blobDao.getAllBlobs(request,response)
    },
    
    addBlob: function(request,response) {
        blobDao.addBlob(request,response)
    },
}