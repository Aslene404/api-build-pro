var express = require('express');
var multer = require('multer');
var router = express.Router();
var Pub = require('../../db/models/pub-schemas');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/photos');
    },
    filename: function (req, file, cb) {
        var pubId = req.body.id;
        var path = file.fieldname + '-' + Date.now() + '-'+pubId + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, path);

        updatePub(pubId, path)
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

async function updatePub(id, path) {
    await Pub.findByIdAndUpdate({ _id: id }, { $set: { image_url: 'uploads/photos/'+path } },
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