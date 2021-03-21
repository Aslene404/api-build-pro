var express = require('express');
var multer = require('multer');
var router = express.Router();
var Product = require('../../db/models/product-schemas');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/photos');
    },
    filename: function (req, file, cb) {
        var productId = req.body.id;
        var path = file.fieldname + '-' + Date.now() + '-'+productId + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, path);

        updateProduct(productId, path)
            .then(function () {
                return
            })
            .catch(function (err) {
                res.json({
                    status: "error",
                    message: "Sorry an error occured :(",
                    payload: null
                });
            });
    }
});

var upload = multer({ //multer settings
    storage: storage
}).any('picture');

async function updateProduct(id, path) {
    await Product.findByIdAndUpdate({ _id: id }, { $set: { image_url: 'uploads/photos/'+path } },
        function (err, doc) {
            if (err) {
                next();
            }
        });
}

router.post('/', upload, function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            res.json({
                status: "error",
                message: "Sorry an error occured while upload the Product Picture :(",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Product picture uploaded and updated succssufully",
                payload: null
            });
        }
    });
});

module.exports = router;
