var express = require('express');
var multer = require('multer');
const app = express();
var router = express.Router();
var Pub = require('../../db/models/pub-schemas');
const cloudinary = require("cloudinary").v2;
const bodyParser = require('body-parser');
var xd;
// body parser configuration
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// cloudinary configuration
cloudinary.config({
    cloud_name: "ddejpouvy",
    api_key: "755331696423856",
    api_secret: "x7fys7aeymVPlmtMjaIBVpIwmBs"
  });

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/photos');
    },
    filename: function (req, file, cb) {
        var pubId = req.body.id;
        var path = file.fieldname + '-' + Date.now() + '-'+pubId + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, path);
       
        updatePub(pubId, path);
            
    }
});

var upload = multer({ //multer settings
    storage: storage
}).any('picture');


app.get("/", (request, response) => {
    response.json({ message: "Hey! This is your server response!" });
  });
  
  // image upload API
  app.post("/image-upload", (request, response) => {
      // collected image from a user
      const data = {
        image: request.body.image,
      }
  //'uploads/photos/'+path
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
  
  

 

 
 async function updatePub(id, path) {
     await cloudinary.uploader.upload('uploads/photos/'+path, function(error, result) { console.log(result);xd=result.url });
     
        setTimeout(function(){ Pub.findByIdAndUpdate({ _id: id }, { $set: { image_url: xd } },
            function (err, doc) {
                if (err) {
                    next();
                }
            }); }, 10000);
    
    
}

router.post('/', upload, function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            res.json({
                status: "error",
                message: "Sorry an error occured while upload the Pub Picture :(",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Pub picture uploaded and updated succssufully",
                payload: null
            });
        }
    });
});

module.exports = router;
