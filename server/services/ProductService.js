const productDao = require('../daos/ProductDao') 

module.exports = {
    getAllProducts: function(request,response) {
        productDao.getAllProducts(request,response)
    },

    getProductById: function(request,response)  {
        productDao.getProductById(request,response);
    },

    addProduct: function(request,response) {
        productDao.addProduct(request,response);
    },

    updateProduct: function(request,response) {
        productDao.updateProduct(request,response);
    },
    
    deleteProduct: function(request,response) {
        productDao.deleteProduct(request,response);
    }

}