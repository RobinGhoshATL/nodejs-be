const dao = require('../daos/SchoolDao') 

module.exports = {
    getUserSchoolDetails: function(request,response) {
        dao.getUserSchoolDetails(request,response)
    }

}