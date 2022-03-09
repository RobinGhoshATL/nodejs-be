var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const port = 3003; 

var app = express();

var indexRouter = require('./routes/index');
var productsRouter = require('./server/controllers/ProductRoutes') 
var blobRouter = require('./server/controllers/BlobRoutes');
var schoolRouter = require('./server/controllers/SchoolRoutes');


// fixed Cors issue
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
 
app.use(logger('dev'));
app.use(bodyparser.json({limit: "1000mb"}));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/upload", express.static('assets')); //use prefix upload and directory assets

//Swagger Configuration
const swaggerOptions = {
  openapi: '3.0.0',
  swaggerDefinition: {
    info: {
      title:'Bottler API',
      version:'1.0.0', 
    }, 
    securityDefinitions:{
      Bearer:{
        type: 'apiKey',
        name: 'authorization',
        in: 'header'
      }
    },
    "tags": [{
      "name": "product",
      "description": "Everything about your Products",
      "externalDocs": {
        // "description": "Find out more",
        // "url": "http://swagger.io"
      }
    },
    {
      "name": "blob",
      "description": "Everything about your Blobs"
    },
  
  ],
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Development server',
      },
    ],
  },
  apis:['./server/controllers/productroutes.js'],
}
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));


app.use('/', indexRouter);
app.use('/api/product', productsRouter);
app.use('/api/blob', blobRouter);
app.use('/api/school', schoolRouter);


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(`${port}`, () => {
  console.log("listing the port at " + `${port}`)
});

module.exports = app;
