const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cloudinary = require('cloudinary').v2
const bodyParser = require('body-parser');

// cloudinary configuration
cloudinary.config({
  cloud_name: "ddejpouvy",
  api_key: "755331696423856",
  api_secret: "x7fys7aeymVPlmtMjaIBVpIwmBs"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ message: "Hey! This is your server response!" });
});

// image upload API
app.post("/image-upload", (request, response) => {
    // collected image from a user
    const data = {
      image: request.body.image,
    }

    // upload image here
    cloudinary.uploader.upload(data.image)
    .then((result) => {
      response.status(200).send({
        message: "success",
        result,
      });
    }).catch((error) => {
      response.status(500).send({
        message: "failure",
        error,
      });
    });

});


const usersRouter = require('./routes/users');
const contactRouter= require('./routes/contact');
const entrepriseRouter= require('./routes/entreprise');
const productRouter= require('./routes/product');
const trendRouter= require('./routes/trend');
const pubRouter= require('./routes/pub');
const inspireRouter= require('./routes/inspire');
const e_projectsRouter= require('./routes/e_projects');
const devisRouter= require('./routes/devis');
const entrepriseLogoUploader = require('./routes/uploads/entreprise-logo-upload');
const productImageUploader = require('./routes/uploads/product-image-upload');
const trendImageUploader = require('./routes/uploads/trend-image-upload');
const pubImageUploader = require('./routes/uploads/pub-image-upload');
const inspireImageUploader = require('./routes/uploads/inspire-image-upload');

const e_projectsPhotoUploader = require('./routes/uploads/e_projects-photo-upload');

const materialsRouter= require('./routes/materials');
const projectsRouter= require('./routes/projects');
const tasksRouter= require('./routes/tasks');


app.use(cors());

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


app.use('/api/v1/users', usersRouter);
app.use('/api/v1/contact' ,contactRouter);
app.use('/api/v1/entreprise' ,entrepriseRouter);
app.use('/api/v1/product' ,productRouter);
app.use('/api/v1/trend' ,trendRouter);
app.use('/api/v1/pub' ,pubRouter);
app.use('/api/v1/inspire' ,inspireRouter);
app.use('/api/v1/e_projects' ,e_projectsRouter);
app.use('/api/v1/devis' ,devisRouter);
app.use('/api/v1/upload/entreprise/logo',entrepriseLogoUploader);
app.use('/api/v1/upload/product/image',productImageUploader);
app.use('/api/v1/upload/trend/image',trendImageUploader);
app.use('/api/v1/upload/pub/image',pubImageUploader);
app.use('/api/v1/upload/inspire/image',inspireImageUploader);

app.use('/api/v1/upload/e_projects/photo',e_projectsPhotoUploader);
app.use('/api/v1/materials', materialsRouter);
app.use('/api/v1/tasks', tasksRouter);

app.use('/api/v1/projects', projectsRouter);
app.use('/uploads/photos', express.static(path.join(__dirname, 'uploads/photos')));
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error 
  res.status(err.status || 500);
  res.json({
    error: 'error server code:500'
  });
});

module.exports = app;
