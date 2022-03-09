var db = {
    
    authentication: {
      options: {
        userName: process.env.USERID ,
        password: process.env.PASSWORD
      },
      type: "default"
    },
    server: process.env.SQLSERVERNAME,
    options: {
      database: process.env.SQLDATABASENAME, //update me
      encrypt: true,
      rowCollectionOnDone: true,
      rowCollectionOnRequestCompletion:true
    }

}

module.exports = db;
